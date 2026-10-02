#!/usr/bin/env python3
"""Pull public Tech My Space content into seed/content.json."""

from __future__ import annotations

import html
import json
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

BASE = "https://techmyspace.co.uk/wp-json/wp/v2"
OUT = Path(__file__).resolve().parents[1] / "seed" / "content.json"
USER_AGENT = "TechMySpaceSeed/1.0"

SERVICE_SLUGS = {
    "alarms": "alarms",
    "cctv": "cctv",
    "security-systems": "security",
    "structured-cabling": "structured-cabling",
    "communication": "communication",
    "av-audio-visual": "av",
}

SERVICE_ORDER = [
    "alarms",
    "cctv",
    "security",
    "structured-cabling",
    "communication",
    "av",
]

CASE_STUDY_SLUGS = {
    "audio-visual-upgrade-upcycle-av": "audio-visual-upgrade",
    "1-simple-project": "simple-project",
    "large-project-domestic-4k-av": "large-project",
}

PAGES = {
    "about-us": {
        "slug": "about",
        "kind": "page",
        "path": "/about",
        "legacyPaths": ["/about-us"],
    },
    "contact-us": {
        "slug": "contact",
        "kind": "page",
        "path": "/contact",
        "legacyPaths": ["/contact-us", "/contact"],
    },
    "customers": {
        "slug": "customers",
        "kind": "page",
        "path": "/customers",
        "legacyPaths": [],
    },
    "special-offers": {
        "slug": "offers",
        "kind": "page",
        "path": "/offers",
        "legacyPaths": ["/special-offers"],
    },
    "glossary-of-technical-terms-used-by-tms": {
        "slug": "glossary",
        "kind": "page",
        "path": "/glossary",
        "legacyPaths": ["/glossary-of-technical-terms-used-by-tms"],
    },
    "author-dave": {
        "slug": "dave",
        "kind": "team",
        "path": "/team/dave",
        "legacyPaths": ["/author-dave", "/author/tmsadmin"],
    },
    "cctv-images-around-stockport": {
        "slug": "gallery-cctv",
        "kind": "gallery",
        "path": "/galleries/cctv",
        "legacyPaths": ["/cctv-images-around-stockport"],
    },
    "alarm-images-in-stockport-cheshire-manchester": {
        "slug": "gallery-alarms",
        "kind": "gallery",
        "path": "/galleries/alarms",
        "legacyPaths": ["/alarm-images-in-stockport-cheshire-manchester"],
    },
    "terms-and-conditions-general": {
        "slug": "general",
        "kind": "legal",
        "path": "/legal/general",
        "legacyPaths": ["/terms-and-conditions-general"],
    },
    "terms-and-conditions-sales": {
        "slug": "sales",
        "kind": "legal",
        "path": "/legal/sales",
        "legacyPaths": ["/terms-and-conditions-sales"],
    },
    "terms-and-conditions-website": {
        "slug": "website",
        "kind": "legal",
        "path": "/legal/website",
        "legacyPaths": ["/terms-and-conditions-website"],
    },
}

JUNK_TITLES = {
    "x",
    "page contents",
    "page contents…",
    "select a button for more info…",
    "select a button for more info",
}


def fetch_json(url: str):
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=90) as response:
        return json.load(response)


def fetch_collection(resource: str) -> list[dict]:
    page = 1
    items: list[dict] = []
    while True:
        url = f"{BASE}/{resource}?per_page=50&page={page}&_embed"
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=90) as response:
            batch = json.load(response)
            total_pages = int(response.headers.get("X-WP-TotalPages") or "1")
        items.extend(batch)
        if page >= total_pages:
            return items
        page += 1


def clean_text(value: str) -> str:
    value = html.unescape(value)
    value = value.replace("\xa0", " ")
    value = re.sub(r"\s+", " ", value).strip()
    return value


class Extractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.blocks: list[tuple[str, str]] = []
        self.images: list[tuple[str, str]] = []
        self._skip = 0
        self._capture: str | None = None
        self._buf: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {key: value or "" for key, value in attrs}
        if tag in {"script", "style", "noscript", "svg", "form"}:
            self._skip += 1
            return
        if self._skip:
            return
        if tag == "br" and self._capture:
            self._buf.append(" ")
        if tag == "img":
            src = attr.get("src") or attr.get("data-src") or attr.get("data-lazy-src")
            if src:
                self.images.append((src, clean_text(attr.get("alt", ""))))
        style = attr.get("style", "")
        for match in re.findall(r"url\((?:&quot;|[\"'])?(https?://[^)\"']+)", style):
            self.images.append((html.unescape(match), ""))
        if tag in {"h2", "h3", "h4", "p", "li", "blockquote"}:
            if self._capture:
                self._flush()
            self._capture = "h3" if tag == "h4" else ("p" if tag == "blockquote" else tag)
            self._buf = []

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript", "svg", "form"} and self._skip:
            self._skip -= 1
            return
        if self._capture and tag in {"h2", "h3", "h4", "p", "li", "blockquote"}:
            self._flush()

    def handle_data(self, data: str) -> None:
        if self._skip or self._capture is None:
            return
        self._buf.append(data)

    def _flush(self) -> None:
        if self._capture is None:
            return
        text = clean_text("".join(self._buf))
        kind = self._capture
        self._capture = None
        self._buf = []
        if text:
            self.blocks.append((kind, text))


def is_junk_title(title: str) -> bool:
    normalised = title.strip().lower().rstrip(".… ")
    if normalised in JUNK_TITLES or normalised.startswith("page content"):
        return True
    return len(normalised) <= 1


def image_key(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    path = re.sub(r"-\d+x\d+(?=\.(?:jpe?g|png|webp|avif)$)", "", path, flags=re.I)
    path = re.sub(r"-scaled(?=\.)", "", path, flags=re.I)
    return path.lower()


def image_score(url: str) -> int:
    match = re.search(r"-(\d+)x(\d+)(?=\.(?:jpe?g|png|webp|avif)$)", url, flags=re.I)
    if not match:
        return 10_000_000
    return int(match.group(1)) * int(match.group(2))


def select_images(pairs: list[tuple[str, str]], limit: int) -> list[dict[str, str]]:
    best: dict[str, tuple[int, str, str]] = {}
    order: list[str] = []
    for src, alt in pairs:
        if not src or src.startswith("data:"):
            continue
        absolute = urllib.parse.urljoin("https://techmyspace.co.uk/", src)
        if "/wp-content/uploads/" not in absolute:
            continue
        lowered = absolute.lower()
        if any(token in lowered for token in ("logo", "favicon", "gravatar", "emoji", "smiley")):
            continue
        key = image_key(absolute)
        score = image_score(absolute)
        if key not in best:
            order.append(key)
            best[key] = (score, absolute, alt)
            continue
        current_score, _current_url, current_alt = best[key]
        if score > current_score:
            best[key] = (score, absolute, alt or current_alt)
    selected = []
    for key in order:
        _score, url, alt = best[key]
        selected.append({"url": url, "alt": alt})
        if len(selected) >= limit:
            break
    return selected


def featured_image(item: dict) -> list[tuple[str, str]]:
    media = item.get("_embedded", {}).get("wp:featuredmedia") or []
    if not media:
        return []
    source = media[0].get("source_url") or ""
    alt = clean_text(media[0].get("alt_text") or "")
    return [(source, alt)] if source else []


def extract(item: dict) -> Extractor:
    parser = Extractor()
    parser.feed(item.get("content", {}).get("rendered") or "")
    return parser


def body_without_features(blocks: list[tuple[str, str]], consumed_titles: set[str]) -> str:
    skipping = False
    kept: list[tuple[str, str]] = []
    for kind, text in blocks:
        if kind in {"h2", "h3"}:
            skipping = text in consumed_titles
            if skipping:
                continue
        if skipping and kind in {"p", "li"}:
            continue
        kept.append((kind, text))
    return blocks_to_html(kept)


def paragraphs_to_html(paragraphs: list[str]) -> str:
    return "".join(f"<p>{html.escape(paragraph)}</p>" for paragraph in paragraphs if paragraph)


def blocks_to_html(blocks: list[tuple[str, str]]) -> str:
    parts: list[str] = []
    seen: set[str] = set()
    in_faq = False
    list_open = False

    def close_list() -> None:
        nonlocal list_open
        if list_open:
            parts.append("</ul>")
            list_open = False

    for kind, text in blocks:
        if re.search(r"\bFAQ\b", text, re.I) and len(text) < 80:
            in_faq = True
            close_list()
            continue
        if kind in {"h2", "h3"} and is_junk_title(text):
            close_list()
            continue
        if in_faq or (kind in {"h2", "h3"} and text.endswith("?")):
            close_list()
            continue
        if text.lower().startswith("select a button"):
            continue
        if text in seen and kind == "p":
            continue
        if kind == "p":
            seen.add(text)
        if kind == "li":
            if not list_open:
                parts.append("<ul>")
                list_open = True
            parts.append(f"<li>{html.escape(text)}</li>")
            continue
        close_list()
        if kind in {"h2", "h3"}:
            if is_junk_title(text):
                continue
            parts.append(f"<{kind}>{html.escape(text)}</{kind}>")
            continue
        if len(text) < 25 and text.lower() in JUNK_TITLES:
            continue
        parts.append(f"<p>{html.escape(text)}</p>")
    close_list()
    return "".join(parts)


def sectionise(blocks: list[tuple[str, str]]) -> tuple[list[str], list[dict[str, list[str] | str]]]:
    preamble: list[str] = []
    sections: list[dict[str, list[str] | str]] = []
    current: dict[str, list[str] | str] | None = None
    for kind, text in blocks:
        if kind in {"h2", "h3"}:
            if is_junk_title(text) or text.endswith("?") or re.search(r"\bFAQ\b", text, re.I):
                current = None
                continue
            current = {"title": text, "paras": []}
            sections.append(current)
            continue
        if kind != "p":
            continue
        if current is None:
            preamble.append(text)
        else:
            paras = current["paras"]
            assert isinstance(paras, list)
            paras.append(text)
    return preamble, sections


def build_service(item: dict, order: int) -> dict:
    source_slug = item["slug"]
    slug = SERVICE_SLUGS[source_slug]
    parser = extract(item)
    preamble, sections = sectionise(parser.blocks)
    summary = next((paragraph for paragraph in preamble if len(paragraph) > 80), "")
    if not summary:
        for section in sections:
            paras = section["paras"]
            assert isinstance(paras, list)
            if paras:
                summary = paras[0]
                break
    features = []
    consumed: set[str] = set()
    for section in sections:
        if len(features) >= 6:
            break
        paras = section["paras"]
        assert isinstance(paras, list)
        title = str(section["title"])
        useful = [paragraph for paragraph in paras if len(paragraph) > 40]
        if not useful or len(useful[0]) > 500:
            continue
        features.append({"title": title, "body": paragraphs_to_html(useful[:2])})
        consumed.add(title)
    images = select_images(featured_image(item) + parser.images, 8)
    body = body_without_features(parser.blocks, consumed)
    title = clean_text(item["title"]["rendered"])
    return {
        "slug": slug,
        "menuOrder": order,
        "title": title,
        "summary": summary,
        "body": body,
        "features": features,
        "images": images,
        "metaTitle": f"{title} in Stockport",
        "metaDescription": summary[:155],
        "legacyPaths": [f"/portfolio-items/{source_slug}"],
    }


def service_for_faq(slug: str, title: str) -> str:
    text = f"{slug} {title}".lower()
    if "alarm" in text:
        return "alarms"
    if "cctv" in text or "camera" in text:
        return "cctv"
    if "access" in text or "security" in text or "keys vs" in text:
        return "security"
    if any(token in text for token in ("cabl", "network", "wi-fi", "wifi")):
        return "structured-cabling"
    if any(token in text for token in ("phone", "telecom")):
        return "communication"
    if any(
        token in text
        for token in (
            "av",
            "audio",
            "speaker",
            "hdmi",
            "4k",
            "8k",
            " tv",
            "atmos",
            "surround",
            "streaming",
            "wall-mount",
            "wall mounting",
        )
    ):
        return "av"
    return "cctv"


def build_faq(item: dict) -> dict:
    parser = extract(item)
    title = clean_text(item["title"]["rendered"])
    answer = blocks_to_html(parser.blocks) or paragraphs_to_html(
        [text for _kind, text in parser.blocks]
    )
    return {
        "slug": item["slug"],
        "title": title,
        "answer": answer,
        "service": service_for_faq(item["slug"], title),
        "metaTitle": title,
        "metaDescription": clean_text(re.sub(r"<[^>]+>", " ", answer))[:155],
        "legacyPaths": [f"/faq-items/{item['slug']}"],
    }


def build_case_study(item: dict, order: int) -> dict:
    parser = extract(item)
    title = clean_text(item["title"]["rendered"])
    prose = [text for kind, text in parser.blocks if kind == "p" and len(text) > 80]
    summary = prose[0] if prose else ""
    images = select_images(featured_image(item) + parser.images, 6)
    haystack = " ".join(text for _kind, text in parser.blocks).lower()
    location = ""
    for name in ("Stockport", "Bramhall", "Poynton", "Wilmslow", "Macclesfield", "Prestbury", "Cheadle"):
        if name.lower() in haystack:
            location = name
            break
    quote = next((text for text in prose if len(text) < 220), summary)
    return {
        "slug": CASE_STUDY_SLUGS[item["slug"]],
        "menuOrder": order,
        "title": title,
        "location": location,
        "summary": summary,
        "body": blocks_to_html(parser.blocks),
        "pullQuote": quote,
        "images": images,
        "metaTitle": title,
        "metaDescription": summary[:155],
        "legacyPaths": [f"/case-studies/{item['slug']}"],
    }


def build_page(item: dict) -> dict:
    spec = PAGES[item["slug"]]
    parser = extract(item)
    title = clean_text(re.sub(r"\s+[–-]\s+Tech My Space.*$", "", clean_text(item["title"]["rendered"])))
    paragraphs = [text for kind, text in parser.blocks if kind == "p" and len(text) > 40]
    summary = paragraphs[0] if paragraphs else ""
    limit = 18 if spec["kind"] == "gallery" else 6
    return {
        "slug": spec["slug"],
        "kind": spec["kind"],
        "path": spec["path"],
        "title": title,
        "heroKicker": "Tech My Space",
        "summary": summary,
        "body": blocks_to_html(parser.blocks),
        "images": select_images(featured_image(item) + parser.images, limit),
        "metaTitle": title,
        "metaDescription": summary[:155],
        "legacyPaths": spec["legacyPaths"],
    }


def build_testimonials(home_html: str) -> list[dict]:
    pattern = re.compile(
        r'<blockquote class="testimonials-shortcode-blockquote">(.*?)</blockquote>\s*<div class="author">.*?<strong>(.*?)</strong>\s*,\s*<span>(.*?)</span>',
        re.I | re.S,
    )
    reviews = []
    seen: set[str] = set()
    for body_html, author_html, service_html in pattern.findall(home_html):
        title_match = re.search(r"<h3[^>]*>(.*?)</h3>", body_html, flags=re.I | re.S)
        title = clean_text(re.sub(r"<[^>]+>", " ", title_match.group(1))) if title_match else ""
        author = clean_text(re.sub(r"<[^>]+>", " ", author_html))
        paragraphs = [
            clean_text(re.sub(r"<[^>]+>", " ", paragraph))
            for paragraph in re.findall(r"<p[^>]*>(.*?)</p>", body_html, flags=re.I | re.S)
        ]
        paragraphs = [paragraph for paragraph in paragraphs if len(paragraph) > 20]
        if not paragraphs or not author:
            continue
        quote = "\n\n".join(paragraphs)
        key = f"{author}|{quote[:80]}"
        if key in seen:
            continue
        seen.add(key)
        location = title.split(":")[-1].strip() if ":" in title else ""
        slug = re.sub(r"[^a-z0-9]+", "-", author.lower()).strip("-")
        reviews.append(
            {
                "slug": slug,
                "title": title or author,
                "quote": quote,
                "author": author,
                "location": location,
                "serviceLabel": clean_text(re.sub(r"<[^>]+>", " ", service_html)),
                "metaTitle": title or author,
                "metaDescription": paragraphs[0][:155],
            }
        )
    return reviews


def home_paragraphs(home_html: str) -> list[str]:
    parser = Extractor()
    parser.feed(home_html)
    return [text for kind, text in parser.blocks if kind == "p" and len(text) > 80]


def main() -> None:
    print("fetching")
    portfolios = fetch_collection("avada_portfolio")
    studies = fetch_collection("case-studies")
    faqs = fetch_collection("avada_faq")
    pages = fetch_collection("pages")
    by_slug = {page["slug"]: page for page in pages}
    home = by_slug["cctv-alarms-home-automation-networks-wi-fi-phone-lines"]
    home_html = home["content"]["rendered"]

    services = []
    for item in portfolios:
        if item["slug"] not in SERVICE_SLUGS:
            continue
        slug = SERVICE_SLUGS[item["slug"]]
        services.append(build_service(item, SERVICE_ORDER.index(slug)))
    services.sort(key=lambda service: service["menuOrder"])

    case_studies = []
    for item in studies:
        if item["slug"] not in CASE_STUDY_SLUGS:
            continue
        case_studies.append(build_case_study(item, len(case_studies)))

    faq_items = [build_faq(item) for item in faqs]
    page_items = [build_page(by_slug[slug]) for slug in PAGES if slug in by_slug]
    testimonials = build_testimonials(home_html)

    paragraphs = home_paragraphs(home_html)
    intro = next((paragraph for paragraph in paragraphs if paragraph.startswith("Welcome to Tech My Space")), paragraphs[0] if paragraphs else "")
    areas_body = next((paragraph for paragraph in paragraphs if "SK1" in paragraph or "10 miles" in paragraph), "")
    intro_html = paragraphs_to_html(
        [paragraph for paragraph in paragraphs if "Welcome to Tech My Space" in paragraph or "We work with many leading" in paragraph][:2]
    )

    payload = {
        "site": {
            "name": "Tech My Space",
            "phone": "07815 133771",
            "phoneTel": "+447815133771",
            "tagline": "CCTV, alarms, access, networks and AV in Stockport.",
        },
        "home": {
            "slug": "home",
            "title": "CCTV and Alarms in Stockport",
            "heroKicker": "Stockport, South Manchester and East Cheshire",
            "heroTitle": "Step into the future with our wide range of",
            "heroAccent": "Tech Services",
            "heroSummary": "Free consultations for CCTV, intruder alarms, access control, Wi-Fi networks and audio visual, in and around Stockport.",
            "introTitle": "Let us introduce ourselves",
            "intro": intro_html or paragraphs_to_html([intro]),
            "areas": [
                "Stockport",
                "Bramhall",
                "Cheadle",
                "Gatley",
                "Woodford",
                "Poynton",
                "Wilmslow",
                "Alderley Edge",
                "Prestbury",
                "Macclesfield",
                "SK1–SK10",
                "M1–M34",
            ],
            "areasBody": areas_body,
            "awards": ["SME Awards 2020–23", "SME Awards 2024"],
            "metaTitle": "CCTV and Alarms in Stockport | Tech My Space",
            "metaDescription": "CCTV, intruder alarms, access control, structured cabling, Wi-Fi and AV for homes and offices in Stockport and East Cheshire.",
            "legacyPaths": ["/cctv-alarms-home-automation-networks-wi-fi-phone-lines"],
        },
        "services": services,
        "caseStudies": case_studies,
        "faqs": faq_items,
        "testimonials": testimonials,
        "pages": page_items,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT}")
    print(
        "services",
        len(services),
        "studies",
        len(case_studies),
        "faqs",
        len(faq_items),
        "pages",
        len(page_items),
        "reviews",
        len(testimonials),
    )
    for service in services:
        print(f"  {service['slug']}: features={len(service['features'])} images={len(service['images'])} body={len(service['body'])}")


if __name__ == "__main__":
    main()

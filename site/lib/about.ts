export type AboutPoint = {
  title: string;
  body: string;
};

export type AboutCopy = {
  intro: string[];
  pillars: AboutPoint[];
  guarantees: AboutPoint[];
  steps: AboutPoint[];
};

type Block = {
  kind: "h2" | "h3" | "p";
  text: string;
};

const PILLARS = ["knowledge", "flexibility", "satisfaction"];
const GUARANTEES = ["flexibility", "value", "future"];
const STEPS = [
  "requirements",
  "planning",
  "installation",
  "testing",
  "support",
];

function decode(value: string): string {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&#8216;|&rsquo;|&lsquo;/g, "’")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function blocksFrom(html: string): Block[] {
  const blocks: Block[] = [];
  const pattern = /<(h2|h3|p)>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(pattern)) {
    const kind = match[1].toLowerCase();
    const text = decode(match[2]);
    if (!text) {
      continue;
    }
    if (kind === "h2" || kind === "h3" || kind === "p") {
      blocks.push({ kind, text });
    }
  }
  return blocks;
}

function isJunkHeading(text: string): boolean {
  const value = text.toLowerCase();
  return (
    value.startsWith("about us") ||
    value.startsWith("harnessing") ||
    value.startsWith("our guarantee") ||
    value.startsWith("contact") ||
    value.startsWith("what our clients") ||
    value.startsWith("work &") ||
    value.startsWith("tech my space – the right") ||
    value.startsWith("our proven process")
  );
}

export function aboutCopyFrom(html: string, summary: string): AboutCopy {
  const blocks = blocksFrom(html);
  const intro: string[] = [];
  const pillars: AboutPoint[] = [];
  const guarantees: AboutPoint[] = [];
  const steps: AboutPoint[] = [];
  let pendingTitle = "";
  let stepTitle = "";
  let skippingReviews = false;

  for (const block of blocks) {
    const key = block.text.toLowerCase();

    if (block.kind !== "p" && key.startsWith("what our clients")) {
      skippingReviews = true;
      pendingTitle = "";
      continue;
    }
    if (block.kind !== "p" && key.startsWith("our proven process")) {
      skippingReviews = false;
      pendingTitle = "";
      continue;
    }
    if (
      block.kind !== "p" &&
      (key.startsWith("work &") || key.startsWith("work and"))
    ) {
      break;
    }
    if (skippingReviews) {
      continue;
    }
    if (block.kind !== "p" && isJunkHeading(block.text)) {
      pendingTitle = "";
      continue;
    }

    if (block.kind === "p" && STEPS.includes(key)) {
      stepTitle = block.text;
      pendingTitle = "";
      continue;
    }
    if (stepTitle && block.kind === "p") {
      steps.push({ title: stepTitle, body: block.text });
      stepTitle = "";
      continue;
    }

    if (block.kind === "h2" || block.kind === "h3") {
      pendingTitle = block.text;
      continue;
    }

    if (!pendingTitle) {
      if (
        block.text.length > 80 &&
        block.text !== summary &&
        !block.text.toLowerCase().startsWith("about us")
      ) {
        intro.push(block.text);
      }
      continue;
    }

    const titleKey = pendingTitle.toLowerCase();
    const point = { title: pendingTitle, body: block.text };
    pendingTitle = "";

    if (
      PILLARS.includes(titleKey) &&
      !pillars.some((item) => item.title.toLowerCase() === titleKey)
    ) {
      pillars.push(point);
      continue;
    }
    if (GUARANTEES.includes(titleKey)) {
      guarantees.push(point);
    }
  }

  return { intro, pillars, guarantees, steps };
}

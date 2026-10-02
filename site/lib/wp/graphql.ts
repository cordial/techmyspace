import { routeForPage } from "@/lib/routes";
import type {
  CaseStudy,
  Content,
  ContentPage,
  Faq,
  Feature,
  HomeContent,
  ImageAsset,
  Service,
  SiteInfo,
  Testimonial,
} from "@/lib/types";

const QUERY = `
  query SiteContent {
    services(first: 20) {
      nodes {
        slug
        title
        menuOrder
        featuredImage { node { sourceUrl altText } }
        serviceDetails {
          summary
          body
          metaTitle
          metaDescription
          features { title body }
          gallery { nodes { sourceUrl altText } }
        }
      }
    }
    caseStudies(first: 20) {
      nodes {
        slug
        title
        menuOrder
        featuredImage { node { sourceUrl altText } }
        caseStudyDetails {
          location
          summary
          body
          pullQuote
          metaTitle
          metaDescription
          gallery { nodes { sourceUrl altText } }
        }
      }
    }
    faqs(first: 100) {
      nodes {
        slug
        title
        faqDetails {
          answer
          metaTitle
          metaDescription
          service { nodes { ... on Service { slug } } }
        }
      }
    }
    testimonials(first: 30) {
      nodes {
        slug
        title
        testimonialDetails {
          quote
          author
          location
          serviceLabel
        }
      }
    }
    pages(first: 40) {
      nodes {
        slug
        title
        pageDetails {
          heroKicker
          summary
          body
          metaTitle
          metaDescription
          gallery { nodes { sourceUrl altText } }
        }
        homeDetails {
          heroKicker
          heroTitle
          heroAccent
          heroSummary
          introTitle
          intro
          areasBody
          phone
          phoneTel
          metaTitle
          metaDescription
          areas { label }
          awards { label }
        }
      }
    }
  }
`;

type MediaNode = { sourceUrl?: string | null; altText?: string | null };

type Gallery = { nodes?: MediaNode[] | null } | MediaNode[] | null;

type GraphqlPayload = {
  services?: { nodes?: GraphqlService[] | null } | null;
  caseStudies?: { nodes?: GraphqlCaseStudy[] | null } | null;
  faqs?: { nodes?: GraphqlFaq[] | null } | null;
  testimonials?: { nodes?: GraphqlTestimonial[] | null } | null;
  pages?: { nodes?: GraphqlPage[] | null } | null;
};

type GraphqlService = {
  slug?: string | null;
  title?: string | null;
  menuOrder?: number | null;
  featuredImage?: { node?: MediaNode | null } | null;
  serviceDetails?: {
    summary?: string | null;
    body?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    features?: Array<{
      title?: string | null;
      body?: string | null;
    } | null> | null;
    gallery?: Gallery;
  } | null;
};

type GraphqlCaseStudy = {
  slug?: string | null;
  title?: string | null;
  menuOrder?: number | null;
  featuredImage?: { node?: MediaNode | null } | null;
  caseStudyDetails?: {
    location?: string | null;
    summary?: string | null;
    body?: string | null;
    pullQuote?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    gallery?: Gallery;
  } | null;
};

type GraphqlFaq = {
  slug?: string | null;
  title?: string | null;
  faqDetails?: {
    answer?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    service?:
      | { nodes?: Array<{ slug?: string | null } | null> | null }
      | { slug?: string | null }
      | null;
  } | null;
};

type GraphqlTestimonial = {
  slug?: string | null;
  title?: string | null;
  testimonialDetails?: {
    quote?: string | null;
    author?: string | null;
    location?: string | null;
    serviceLabel?: string | null;
  } | null;
};

type GraphqlPage = {
  slug?: string | null;
  title?: string | null;
  pageDetails?: {
    heroKicker?: string | null;
    summary?: string | null;
    body?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    gallery?: Gallery;
  } | null;
  homeDetails?: {
    heroKicker?: string | null;
    heroTitle?: string | null;
    heroAccent?: string | null;
    heroSummary?: string | null;
    introTitle?: string | null;
    intro?: string | null;
    areasBody?: string | null;
    phone?: string | null;
    phoneTel?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    areas?: Array<{ label?: string | null } | null> | null;
    awards?: Array<{ label?: string | null } | null> | null;
  } | null;
};

function text(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

function mediaList(
  gallery: Gallery | undefined,
  featured?: MediaNode | null,
): ImageAsset[] {
  const nodes = Array.isArray(gallery) ? gallery : (gallery?.nodes ?? []);
  const collected = [featured, ...nodes];
  const seen = new Set<string>();
  const images: ImageAsset[] = [];

  for (const node of collected) {
    const url = node?.sourceUrl ?? "";
    if (!url || seen.has(url)) {
      continue;
    }
    seen.add(url);
    images.push({ url, alt: node?.altText ?? "" });
  }

  return images;
}

function featureList(
  value:
    | Array<{ title?: string | null; body?: string | null } | null>
    | null
    | undefined,
): Feature[] {
  return (value ?? []).flatMap((feature) => {
    const title = text(feature?.title);
    const body = text(feature?.body);
    return title ? [{ title, body }] : [];
  });
}

function faqServiceSlug(
  service:
    | {
        nodes?: Array<{ slug?: string | null } | null> | null;
        slug?: string | null;
      }
    | null
    | undefined,
): string {
  if (!service) {
    return "";
  }
  if (Array.isArray(service.nodes)) {
    return text(service.nodes[0]?.slug);
  }
  return text(service.slug);
}

async function graphql<T>(endpoint: string, query: string): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    next: { revalidate: 60, tags: ["wordpress"] },
  });

  if (!response.ok) {
    throw new Error(`WordPress GraphQL responded with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("\n"));
  }
  if (!payload.data) {
    throw new Error("WordPress GraphQL returned no data.");
  }

  return payload.data;
}

export async function loadFromWordPress(endpoint: string): Promise<Content> {
  const data = await graphql<GraphqlPayload>(endpoint, QUERY);
  const pageNodes = data.pages?.nodes ?? [];
  const homeNode = pageNodes.find((page) => page.slug === "home");
  const homeDetails = homeNode?.homeDetails;

  const site: SiteInfo = {
    name: "Tech My Space",
    phone: text(homeDetails?.phone) || "07815 133771",
    phoneTel: text(homeDetails?.phoneTel) || "+447815133771",
    tagline: "CCTV, alarms, access, networks and AV in Stockport.",
  };

  const home: HomeContent = {
    title: text(homeNode?.title) || "Home",
    heroKicker: text(homeDetails?.heroKicker),
    heroTitle: text(homeDetails?.heroTitle),
    heroAccent: text(homeDetails?.heroAccent),
    heroSummary: text(homeDetails?.heroSummary),
    introTitle: text(homeDetails?.introTitle),
    intro: text(homeDetails?.intro),
    areas: (homeDetails?.areas ?? []).flatMap((area) => {
      const label = text(area?.label);
      return label ? [label] : [];
    }),
    areasBody: text(homeDetails?.areasBody),
    awards: (homeDetails?.awards ?? []).flatMap((award) => {
      const label = text(award?.label);
      return label ? [label] : [];
    }),
    metaTitle: text(homeDetails?.metaTitle) || "Tech My Space",
    metaDescription: text(homeDetails?.metaDescription),
  };

  const services: Service[] = (data.services?.nodes ?? [])
    .flatMap((node) => {
      if (!node.slug) {
        return [];
      }
      const details = node.serviceDetails;
      return [
        {
          slug: node.slug,
          title: text(node.title),
          summary: text(details?.summary),
          body: text(details?.body),
          features: featureList(details?.features),
          images: mediaList(details?.gallery, node.featuredImage?.node),
          metaTitle: text(details?.metaTitle) || text(node.title),
          metaDescription: text(details?.metaDescription),
          menuOrder: node.menuOrder ?? 0,
        },
      ];
    })
    .sort((a, b) => a.menuOrder - b.menuOrder);

  const caseStudies: CaseStudy[] = (data.caseStudies?.nodes ?? [])
    .flatMap((node) => {
      if (!node.slug) {
        return [];
      }
      const details = node.caseStudyDetails;
      return [
        {
          slug: node.slug,
          title: text(node.title),
          location: text(details?.location),
          summary: text(details?.summary),
          body: text(details?.body),
          pullQuote: text(details?.pullQuote),
          images: mediaList(details?.gallery, node.featuredImage?.node),
          metaTitle: text(details?.metaTitle) || text(node.title),
          metaDescription: text(details?.metaDescription),
          menuOrder: node.menuOrder ?? 0,
        },
      ];
    })
    .sort((a, b) => a.menuOrder - b.menuOrder);

  const faqs: Faq[] = (data.faqs?.nodes ?? []).flatMap((node) => {
    if (!node.slug) {
      return [];
    }
    const details = node.faqDetails;
    return [
      {
        slug: node.slug,
        title: text(node.title),
        answer: text(details?.answer),
        service: faqServiceSlug(details?.service),
        metaTitle: text(details?.metaTitle) || text(node.title),
        metaDescription: text(details?.metaDescription),
      },
    ];
  });

  const testimonials: Testimonial[] = (data.testimonials?.nodes ?? []).flatMap(
    (node) => {
      if (!node.slug) {
        return [];
      }
      const details = node.testimonialDetails;
      return [
        {
          slug: node.slug,
          title: text(node.title),
          quote: text(details?.quote),
          author: text(details?.author),
          location: text(details?.location).replace(/\.$/, ""),
          serviceLabel: text(details?.serviceLabel),
        },
      ];
    },
  );

  const pages: ContentPage[] = pageNodes.flatMap((node) => {
    if (!node.slug) {
      return [];
    }
    const route = routeForPage(node.slug);
    if (!route) {
      return [];
    }
    const details = node.pageDetails;
    return [
      {
        slug: node.slug,
        kind: route.kind,
        path: route.path,
        title: text(node.title),
        heroKicker: text(details?.heroKicker) || "Tech My Space",
        summary: text(details?.summary),
        body: text(details?.body),
        images: mediaList(details?.gallery),
        metaTitle: text(details?.metaTitle) || text(node.title),
        metaDescription: text(details?.metaDescription),
      },
    ];
  });

  return { site, home, services, caseStudies, faqs, testimonials, pages };
}

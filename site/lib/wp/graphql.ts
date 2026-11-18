import { routeForPage } from "@/lib/routes";
import type {
  CardItem,
  CaseStudy,
  Content,
  ContentPage,
  Faq,
  Feature,
  HeroDiagram,
  HomeContent,
  ImageAsset,
  PropertyType,
  SectionLayout,
  Service,
  ServiceQuestion,
  ServiceSection,
  SiteInfo,
  Testimonial,
  VenueGuideItem,
} from "@/lib/types";
import { isHeroDiagram } from "@/lib/types";

const QUERY = `
  query SiteContent {
    services(first: 20) {
      nodes {
        slug
        title
        menuOrder
        featuredImage { node { sourceUrl altText } }
        serviceDetails {
          heroTitle
          summary
          heroDiagram
          heroImage { node { sourceUrl altText } }
          heroCaption
          heroButtonLabel
          facts { label }
          sections {
            __typename
            ... on ServiceDetailsSectionsCardsLayout {
              heading
              intro
              cardsItems { title body link }
            }
            ... on ServiceDetailsSectionsPropertyTabsLayout {
              heading
              intro
              propertyTabsItems { tabLabel title body profiles }
            }
            ... on ServiceDetailsSectionsStepsLayout {
              heading
              intro
              stepsItems { title body }
            }
            ... on ServiceDetailsSectionsAccordionLayout {
              heading
              intro
              accordionItems { title body }
            }
            ... on ServiceDetailsSectionsChecklistLayout {
              heading
              intro
              checklistItems { title body }
            }
            ... on ServiceDetailsSectionsVenueGuideLayout {
              heading
              intro
              venueGuideItems {
                navLabel
                title
                body
                profilesLabel
                profiles
                imageCaption
                image { node { sourceUrl altText } }
              }
            }
          }
          body
          metaTitle
          metaDescription
          features { title body }
          questions { question answer }
          surveyHeading
          surveyBody
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

type GraphqlItem = {
  title?: string | null;
  body?: string | null;
  link?: string | null;
  tabLabel?: string | null;
  navLabel?: string | null;
  profilesLabel?: string | null;
  profiles?: string | null;
  imageCaption?: string | null;
  image?: { node?: MediaNode | null } | null;
} | null;

type GraphqlItems = GraphqlItem[] | null | undefined;

type GraphqlSection = {
  __typename?: string | null;
  heading?: string | null;
  intro?: string | null;
  cardsItems?: GraphqlItems;
  propertyTabsItems?: GraphqlItems;
  stepsItems?: GraphqlItems;
  accordionItems?: GraphqlItems;
  checklistItems?: GraphqlItems;
  venueGuideItems?: GraphqlItems;
} | null;

type GraphqlService = {
  slug?: string | null;
  title?: string | null;
  menuOrder?: number | null;
  featuredImage?: { node?: MediaNode | null } | null;
  serviceDetails?: {
    heroTitle?: string | null;
    summary?: string | null;
    heroDiagram?: string[] | string | null;
    heroImage?: { node?: MediaNode | null } | null;
    heroCaption?: string | null;
    heroButtonLabel?: string | null;
    facts?: Array<{ label?: string | null } | null> | null;
    sections?: GraphqlSection[] | null;
    body?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    features?: GraphqlItems;
    questions?: Array<{
      question?: string | null;
      answer?: string | null;
    } | null> | null;
    surveyHeading?: string | null;
    surveyBody?: string | null;
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

function featureList(value: GraphqlItems): Feature[] {
  return (value ?? []).flatMap((feature) => {
    const title = text(feature?.title);
    return title ? [{ title, body: text(feature?.body) }] : [];
  });
}

function cardList(value: GraphqlItems): CardItem[] {
  return (value ?? []).flatMap((item) => {
    const title = text(item?.title);
    return title
      ? [{ title, body: text(item?.body), link: text(item?.link) }]
      : [];
  });
}

function propertyTypeList(value: GraphqlItems): PropertyType[] {
  return (value ?? []).flatMap((item) => {
    const title = text(item?.title);
    if (!title) {
      return [];
    }
    return [
      {
        title,
        body: text(item?.body),
        tabLabel: text(item?.tabLabel) || title,
        profiles: text(item?.profiles),
      },
    ];
  });
}

function venueGuideList(value: GraphqlItems): VenueGuideItem[] {
  return (value ?? []).flatMap((item) => {
    const title = text(item?.title);
    if (!title) {
      return [];
    }
    const [image] = mediaList(null, item?.image?.node);
    return [
      {
        title,
        body: text(item?.body),
        navLabel: text(item?.navLabel),
        profiles: text(item?.profiles),
        profilesLabel: text(item?.profilesLabel),
        image,
        imageCaption: text(item?.imageCaption),
      },
    ];
  });
}

const SECTION_LAYOUTS: Record<string, SectionLayout> = {
  ServiceDetailsSectionsCardsLayout: "cards",
  ServiceDetailsSectionsPropertyTabsLayout: "propertyTabs",
  ServiceDetailsSectionsStepsLayout: "steps",
  ServiceDetailsSectionsAccordionLayout: "accordion",
  ServiceDetailsSectionsChecklistLayout: "checklist",
  ServiceDetailsSectionsVenueGuideLayout: "venueGuide",
};

function serviceSection(section: GraphqlSection): ServiceSection | null {
  const layout = SECTION_LAYOUTS[section?.__typename ?? ""];
  if (!section || !layout) {
    return null;
  }
  const copy = { heading: text(section.heading), intro: text(section.intro) };
  switch (layout) {
    case "cards":
      return { ...copy, layout, items: cardList(section.cardsItems) };
    case "propertyTabs":
      return {
        ...copy,
        layout,
        items: propertyTypeList(section.propertyTabsItems),
      };
    case "steps":
      return { ...copy, layout, items: featureList(section.stepsItems) };
    case "accordion":
      return { ...copy, layout, items: featureList(section.accordionItems) };
    case "checklist":
      return { ...copy, layout, items: featureList(section.checklistItems) };
    case "venueGuide":
      return {
        ...copy,
        layout,
        items: venueGuideList(section.venueGuideItems),
      };
    default: {
      const unhandled: never = layout;
      throw new Error(`Unhandled section layout: ${String(unhandled)}`);
    }
  }
}

function sectionList(value: GraphqlSection[] | null | undefined): ServiceSection[] {
  return (value ?? []).flatMap((section) => {
    const parsed = serviceSection(section);
    return parsed && parsed.items.length ? [parsed] : [];
  });
}

function heroDiagram(value: string[] | string | null | undefined): HeroDiagram | null {
  const raw = text(Array.isArray(value) ? value[0] : value);
  return isHeroDiagram(raw) ? raw : null;
}

function questionList(
  value:
    | Array<{ question?: string | null; answer?: string | null } | null>
    | null
    | undefined,
): ServiceQuestion[] {
  return (value ?? []).flatMap((item) => {
    const question = text(item?.question);
    const answer = text(item?.answer);
    return question ? [{ question, answer }] : [];
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

  const storedHeroTitle = text(homeDetails?.heroTitle);
  const storedHeroAccent = text(homeDetails?.heroAccent);
  const legacyHero =
    storedHeroTitle === "Step into the future with our wide range of" &&
    storedHeroAccent === "Tech Services";

  const home: HomeContent = {
    title: text(homeNode?.title) || "Home",
    heroKicker: text(homeDetails?.heroKicker),
    heroTitle: legacyHero ? "CCTV and alarms" : storedHeroTitle,
    heroAccent: legacyHero ? "in Stockport" : storedHeroAccent,
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
          heroTitle: text(details?.heroTitle),
          summary: text(details?.summary),
          heroDiagram: heroDiagram(details?.heroDiagram),
          heroImage: mediaList(null, details?.heroImage?.node)[0] ?? null,
          heroCaption: text(details?.heroCaption),
          heroButtonLabel: text(details?.heroButtonLabel),
          facts: (details?.facts ?? []).flatMap((fact) => {
            const label = text(fact?.label);
            return label ? [label] : [];
          }),
          sections: sectionList(details?.sections),
          body: text(details?.body),
          features: featureList(details?.features),
          questions: questionList(details?.questions),
          surveyHeading: text(details?.surveyHeading),
          surveyBody: text(details?.surveyBody),
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

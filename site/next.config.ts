import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type RedirectSource = {
  legacyPaths?: string[];
};

type SeedRedirects = {
  home: RedirectSource;
  services: Array<RedirectSource & { slug: string }>;
  caseStudies: Array<RedirectSource & { slug: string }>;
  faqs: Array<RedirectSource & { slug: string }>;
  pages: Array<RedirectSource & { path: string }>;
};

function wordpressImagePatterns(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;
  if (!endpoint) {
    return [];
  }

  try {
    const url = new URL(endpoint);
    const protocol = url.protocol === "https:" ? "https" : "http";
    return [
      { protocol, hostname: url.hostname, pathname: "/wp-content/uploads/**" },
    ];
  } catch {
    return [];
  }
}

function legacyRedirects(): {
  source: string;
  destination: string;
  permanent: true;
}[] {
  const seedPath = resolve(
    process.cwd(),
    "../wordpress/themes/techmyspace/seed/content.json",
  );
  const seed = JSON.parse(readFileSync(seedPath, "utf8")) as SeedRedirects;
  const rules: { source: string; destination: string; permanent: true }[] = [];

  const add = (sources: string[] | undefined, destination: string) => {
    for (const source of sources ?? []) {
      if (source && source !== destination) {
        rules.push({ source, destination, permanent: true });
      }
    }
  };

  add(seed.home.legacyPaths, "/");
  for (const service of seed.services) {
    add(service.legacyPaths, `/services/${service.slug}`);
  }
  for (const study of seed.caseStudies) {
    add(study.legacyPaths, `/case-studies/${study.slug}`);
  }
  for (const faq of seed.faqs) {
    add(faq.legacyPaths, `/faq/${faq.slug}`);
  }
  for (const page of seed.pages) {
    add(page.legacyPaths, page.path);
  }

  return rules;
}

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects();
  },
  images: {
    // Local WordPress (techmyspace.local) resolves to 127.0.0.1. Next blocks that unless this is set.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "techmyspace.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.techmyspace.co.uk",
        pathname: "/wp-content/uploads/**",
      },
      ...(wordpressImagePatterns() ?? []),
    ],
  },
};

export default nextConfig;

import { cache } from "react";

import type { CaseStudy, Content, ContentPage, Faq, Service, Testimonial } from "@/lib/types";

import { loadFromWordPress } from "./graphql";
import { loadSeed } from "./seed";

export const getContent = cache(async (): Promise<Content> => {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL?.trim();
  if (!endpoint) {
    return loadSeed();
  }

  return loadFromWordPress(endpoint);
});

export async function getSite() {
  return (await getContent()).site;
}

export async function getHome() {
  return (await getContent()).home;
}

export async function getServices(): Promise<Service[]> {
  return (await getContent()).services;
}

export async function getService(slug: string): Promise<Service | undefined> {
  return (await getServices()).find((service) => service.slug === slug);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return (await getContent()).caseStudies;
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  return (await getCaseStudies()).find((study) => study.slug === slug);
}

export async function getFaqs(): Promise<Faq[]> {
  return (await getContent()).faqs;
}

export async function getFaq(slug: string): Promise<Faq | undefined> {
  return (await getFaqs()).find((faq) => faq.slug === slug);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return (await getContent()).testimonials;
}

export async function getPages(): Promise<ContentPage[]> {
  return (await getContent()).pages;
}

export async function getPage(slug: string): Promise<ContentPage | undefined> {
  return (await getPages()).find((page) => page.slug === slug);
}

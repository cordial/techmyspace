import { Header } from "@/components/header";
import { getServices, getSite } from "@/lib/wp/content";

export async function SiteHeader() {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  return <Header site={site} services={services.map((service) => ({ slug: service.slug, title: service.title }))} />;
}

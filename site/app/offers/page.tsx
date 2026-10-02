import {
  contentPageMetadata,
  renderContentPage,
} from "@/lib/content-page-route";

export function generateMetadata() {
  return contentPageMetadata("offers");
}

export default function OffersPage() {
  return renderContentPage("offers");
}

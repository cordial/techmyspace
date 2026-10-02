import {
  contentPageMetadata,
  renderContentPage,
} from "@/lib/content-page-route";

export function generateMetadata() {
  return contentPageMetadata("customers");
}

export default function CustomersPage() {
  return renderContentPage("customers");
}

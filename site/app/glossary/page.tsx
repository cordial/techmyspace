import {
  contentPageMetadata,
  renderContentPage,
} from "@/lib/content-page-route";

export function generateMetadata() {
  return contentPageMetadata("glossary");
}

export default function GlossaryPage() {
  return renderContentPage("glossary");
}

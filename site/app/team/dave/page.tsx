import {
  contentPageMetadata,
  renderContentPage,
} from "@/lib/content-page-route";

export function generateMetadata() {
  return contentPageMetadata("dave");
}

export default function DavePage() {
  return renderContentPage("dave");
}

import {
  contentPageMetadata,
  renderContentPage,
} from "@/lib/content-page-route";

export function generateMetadata() {
  return contentPageMetadata("gallery-cctv");
}

export default function CctvGalleryPage() {
  return renderContentPage("gallery-cctv");
}

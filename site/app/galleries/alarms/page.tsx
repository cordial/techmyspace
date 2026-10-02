import {
  contentPageMetadata,
  renderContentPage,
} from "@/lib/content-page-route";

export function generateMetadata() {
  return contentPageMetadata("gallery-alarms");
}

export default function AlarmGalleryPage() {
  return renderContentPage("gallery-alarms");
}

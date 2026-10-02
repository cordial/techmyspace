import { MediaFrame } from "@/components/media-frame";
import type { ImageAsset } from "@/lib/types";

export function Gallery({ images }: { images: ImageAsset[] }) {
  if (!images.length) {
    return null;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <li key={image.url}>
          <MediaFrame src={image.url} alt={image.alt} className="aspect-[4/3]" />
        </li>
      ))}
    </ul>
  );
}

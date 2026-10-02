import Image from "next/image";

export function MediaFrame({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-charcoal ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName}`}
      />
    </div>
  );
}

import Image from "next/image";

type CachedRemoteImageProps = {
  src: string | null | undefined;
  alt: string;
  className: string;
  sizes: string;
};

function isOptimizableImageUrl(
  value: string,
): value is string {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "images.unsplash.com" ||
        url.hostname === "res.cloudinary.com")
    );
  } catch {
    return false;
  }
}

export default function CachedRemoteImage({
  src,
  alt,
  className,
  sizes,
}: CachedRemoteImageProps) {
  if (!src) {
    return <div aria-hidden="true" className={className} />;
  }

  if (isOptimizableImageUrl(src)) {
    return (
      <Image
        alt={alt}
        className={className}
        fill
        quality={75}
        sizes={sizes}
        src={src}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={`${className} bg-cover bg-center`}
      role="img"
      style={{ backgroundImage: `url(${JSON.stringify(src)})` }}
    />
  );
}

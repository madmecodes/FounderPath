"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shows a pixel-art asset if it loads, else falls back to an emoji glyph.
 * Robust against the pre-hydration race: if the image already errored before
 * React attached onError (common for 404s), we detect it on mount via
 * complete + naturalWidth and swap to the emoji.
 */
export default function Sprite({
  src,
  emoji,
  alt,
  className = "",
  sizes,
  emojiClassName = "text-[2.5em]",
}: {
  src?: string;
  emoji: string;
  alt: string;
  className?: string;
  sizes?: string;
  emojiClassName?: string;
}) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setFailed(!src);
    const img = ref.current;
    // Image finished loading but has no pixels => it errored (e.g. 404).
    if (src && img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <span className={`flex items-center justify-center ${className}`} role="img" aria-label={alt}>
        <span className={`${emojiClassName} leading-none drop-shadow-[0_3px_0_rgba(0,0,0,0.45)]`}>
          {emoji}
        </span>
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={`pixelated object-contain ${className}`}
    />
  );
}

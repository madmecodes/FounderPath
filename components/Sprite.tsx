"use client";

import { useState } from "react";

/** Shows a pixel-art asset if it loads, else falls back to an emoji glyph. */
export default function Sprite({
  src,
  emoji,
  alt,
  className = "",
  sizes,
}: {
  src?: string;
  emoji: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className={`flex items-center justify-center ${className}`} role="img" aria-label={alt}>
        <span className="text-[2.5em] leading-none drop-shadow-[0_3px_0_rgba(0,0,0,0.4)]">{emoji}</span>
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={`pixelated object-contain ${className}`}
    />
  );
}

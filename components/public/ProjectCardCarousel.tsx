"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt: string;
  priority?: boolean;
  /** Auto-rotate interval in ms. 0 = disabled. Default 4500ms. */
  intervalMs?: number;
};

/**
 * Image carousel for project cards.
 *
 * - 1 image: render that image, no carousel UI
 * - 2+ images: auto-rotate every `intervalMs` (default 4.5s), pause on hover
 *   of the parent group, show clickable dot pagination at bottom-center
 */
export function ProjectCardCarousel({ images, alt, priority, intervalMs = 4500 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (count < 2 || paused || intervalMs <= 0) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, paused, intervalMs]);

  if (count === 0) return null;

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Image
          key={src + i}
          src={src}
          alt={i === 0 ? alt : `${alt} — image ${i + 1}`}
          fill
          quality={90}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority && i === 0}
          className={`object-cover transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0B1320]/70 backdrop-blur-md border border-white/15">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
              }}
              aria-label={`Show image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

type Variant = "warm" | "dark" | "minimal";

const FRAME = {
  warm: "rounded-[4px] border border-[#EADFCF] shadow-[0_20px_60px_-20px_rgba(42,36,32,0.35)]",
  dark: "border border-[#2E2820]",
  minimal: "border border-[#E8E8E6]",
} as const;

const DOT = {
  warm: { active: "bg-white", idle: "bg-white/40" },
  dark: { active: "bg-[#C9A063]", idle: "bg-[#C9A063]/35" },
  minimal: { active: "bg-[#131313]", idle: "bg-[#131313]/25" },
} as const;

export function HeroGallery({
  images,
  variant,
  className = "",
  fullBleed = false,
}: {
  images: string[];
  variant: Variant;
  className?: string;
  fullBleed?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 4500);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden ${fullBleed ? "" : FRAME[variant]} ${className}`}>
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src + i}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 ? (
        <div
          className={`absolute left-1/2 flex -translate-x-1/2 gap-1.5 ${fullBleed ? "bottom-6" : "bottom-3"}`}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}. kép megjelenítése`}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-colors ${fullBleed ? "h-2 w-2" : "h-1.5 w-1.5"} ${
                i === index ? DOT[variant].active : DOT[variant].idle
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

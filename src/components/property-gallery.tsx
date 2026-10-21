"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, House } from "lucide-react";

type PropertyGalleryProps = {
  images: string[];
  title: string;
  demoArt?: string;
};

const demoArtClasses: Record<string, string> = {
  "listing-art-one": "listing-art-one",
  "listing-art-two": "listing-art-two",
  "listing-art-three": "listing-art-three",
};

export default function PropertyGallery({
  images,
  title,
  demoArt,
}: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = images.length;
  const hasImages = imageCount > 0;
  const moveTo = (index: number) => {
    setActiveIndex((index + imageCount) % imageCount);
  };

  return (
    <div
      aria-label={`Photos for ${title}`}
      className={`relative isolate flex aspect-[4/3] min-h-[260px] items-center justify-center overflow-hidden rounded-[24px] ${
        hasImages
          ? "bg-[#e5ebe2]"
          : demoArt
            ? `listing-art ${demoArtClasses[demoArt] ?? "listing-art-one"}`
            : "house-scene"
      }`}
      role="region"
    >
      {hasImages ? (
        <Image
          alt={`${title}, photo ${activeIndex + 1} of ${imageCount}`}
          className="object-cover"
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 768px) 100vw, 60vw"
          src={images[activeIndex]}
          unoptimized
        />
      ) : (
        <>
          <span className="flex size-20 items-center justify-center rounded-3xl border border-white/70 bg-white/75 text-[#176b50] shadow-sm">
            <House aria-hidden="true" size={38} strokeWidth={1.5} />
          </span>
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#53625d]">
            {demoArt ? "Illustrative art · demo" : "No photos provided"}
          </span>
        </>
      )}

      {imageCount > 1 && (
        <>
          <button
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#172b27] shadow transition hover:bg-white"
            onClick={() => moveTo(activeIndex - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={21} />
          </button>
          <button
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#172b27] shadow transition hover:bg-white"
            onClick={() => moveTo(activeIndex + 1)}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={21} />
          </button>
          <span
            aria-live="polite"
            className="absolute bottom-4 right-4 rounded-full bg-[#172b27]/80 px-3 py-1.5 text-xs font-semibold text-white"
          >
            {activeIndex + 1} / {imageCount}
          </span>
        </>
      )}
    </div>
  );
}

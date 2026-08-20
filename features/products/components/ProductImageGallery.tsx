"use client";

import { useState, type MouseEvent } from "react";
import type { ProductImage } from "@/types";

export function ProductImageGallery({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const active = images[activeIndex];

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  if (!active) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4">
        <div
          className="bg-surface-muted relative aspect-square w-full cursor-crosshair overflow-hidden rounded-lg"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked external photo, not a local optimizable asset */}
          <img
            src={active.url}
            alt={active.alt}
            className="h-full w-full object-cover"
          />
          {/* Lens overlay marking the region shown in the zoom panel */}
          {isZooming && (
            <div
              aria-hidden="true"
              className="border-accent-500 bg-accent-500/10 pointer-events-none absolute h-28 w-28 border-2"
              style={{
                left: `calc(${zoomPosition.x}% - 3.5rem)`,
                top: `calc(${zoomPosition.y}% - 3.5rem)`,
              }}
            />
          )}
        </div>

        {/* Zoom panel — desktop only, appears beside the main image on hover */}
        {isZooming && (
          <div
            aria-hidden="true"
            className="border-surface-border bg-surface-muted relative hidden aspect-square w-full overflow-hidden rounded-lg border lg:block"
            style={{
              backgroundImage: `url(${active.url})`,
              backgroundSize: "200%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                index === activeIndex
                  ? "border-accent-500"
                  : "border-transparent hover:border-zinc-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked external photo, not a local optimizable asset */}
              <img
                src={image.url}
                alt={image.alt}
                className="bg-surface-muted h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

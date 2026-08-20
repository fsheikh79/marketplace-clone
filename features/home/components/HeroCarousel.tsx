"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/features/home/lib/heroSlides";
import { Button } from "@/components/ui/Button";

const AUTO_ADVANCE_MS = 5000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(next, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [next, isPaused]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      className="relative h-[420px] w-full overflow-hidden sm:h-[480px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked external photo, not a local optimizable asset */}
          <img
            src={slide.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="from-brand-950/85 via-brand-950/40 absolute inset-0 bg-gradient-to-r to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg">
                <span className="bg-accent-500 text-brand-950 inline-block rounded-sm px-3 py-1 text-xs font-bold tracking-wide uppercase">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {slide.title}
                </h2>
                <p className="mt-3 text-base text-zinc-200">{slide.body}</p>
                <Link href={slide.ctaHref} className="mt-6 inline-block">
                  <Button variant="primary" className="h-12 px-7 text-base">
                    {slide.ctaLabel}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

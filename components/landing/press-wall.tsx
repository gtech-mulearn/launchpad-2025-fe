"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Clipping } from "./content";
import { EASE, viewport } from "./motion";

const DIR = "/media/press";
const pad = (n: number) => String(n).padStart(2, "0");

/** Tallest a thumbnail may be, relative to its width. Longer scans are cropped from the top. */
const MAX_RATIO = 1.45;

function Thumb({ item }: { item: Clipping }) {
  const small = Math.min(640, item.width);
  const set = (ext: string) =>
    small < item.width
      ? `${DIR}/${item.slug}-640.${ext} ${small}w, ${DIR}/${item.slug}.${ext} ${item.width}w`
      : `${DIR}/${item.slug}-640.${ext} ${small}w`;
  const sizes = "(min-width: 1440px) 340px, (min-width: 768px) 24vw, 46vw";
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${DIR}/${item.slug}-640.webp`}
        alt=""
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </picture>
  );
}

export function PressWall({ items }: { items: Clipping[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const current = index === null ? null : items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (index === null && dialog.open) {
      dialog.close();
    }
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const close = () => setIndex(null);
  const step = (dir: 1 | -1) =>
    setIndex((i) => (i === null ? null : (i + dir + items.length) % items.length));

  return (
    <>
      <ul className="columns-2 gap-x-4 md:columns-4 md:gap-x-6">
        {items.map((item, i) => (
          <li key={item.slug} className="mb-10 break-inside-avoid md:mb-14">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Read “${item.headline}”, ${item.outlet}`}
              onClick={() => setIndex(i)}
              className="group block w-full text-left focus-visible:outline-none"
            >
              {/* Trigger on the outer box; the inner one starts fully clipped and would never intersect. */}
              <motion.span
                className="block"
                initial={reduce ? false : "hidden"}
                whileInView="shown"
                viewport={viewport}
              >
                <motion.span
                  className="block overflow-hidden bg-white ring-1 ring-ink/10 transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-primary-500"
                  style={{
                    aspectRatio: `${item.width} / ${Math.min(item.height, item.width * MAX_RATIO)}`,
                  }}
                  variants={{
                    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
                    shown: {
                      clipPath: "inset(0% 0% 0% 0%)",
                      transition: { duration: 1.2, ease: EASE, delay: (i % 4) * 0.08 },
                    },
                  }}
                >
                  <motion.span
                    className="block h-full w-full"
                    variants={{
                      hidden: { scale: 1.18 },
                      shown: {
                        scale: 1,
                        transition: { duration: 1.6, ease: EASE, delay: (i % 4) * 0.08 },
                      },
                    }}
                  >
                    <Thumb item={item} />
                  </motion.span>
                </motion.span>
              </motion.span>

              <span className="mt-3 flex items-baseline justify-between gap-3 text-xs text-ink/50">
                <span>{item.outlet}</span>
                <span className="shrink-0">{item.language === "Malayalam" ? "ML" : "EN"}</span>
              </span>
              <span className="mt-1 block text-sm font-medium leading-snug tracking-[-0.01em] transition-colors group-hover:text-primary-600 md:text-base">
                {item.headline}
              </span>
              {item.date && <span className="mt-1 block text-xs text-ink/50">{item.date}</span>}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="press-reader-title"
        onClose={() => {
          document.documentElement.style.overflow = "";
          setIndex(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-ink p-0 text-white backdrop:bg-ink"
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <header className="flex items-start justify-between gap-6 border-b border-white/10 px-4 py-4 sm:px-6 lg:px-10">
              <div>
                <p className="text-xs text-white/50">
                  {pad(index + 1)} / {pad(items.length)} · {current.outlet} · {current.language}
                  {current.date ? ` · ${current.date}` : ""}
                </p>
                <h3
                  id="press-reader-title"
                  className="mt-1 max-w-[40ch] text-lg font-semibold leading-tight tracking-[-0.02em] md:text-2xl"
                >
                  {current.headline}
                </h3>
                {current.language === "Malayalam" && (
                  <p className="mt-1 text-xs text-white/40">Headline translated from Malayalam</p>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                className="shrink-0 text-sm text-white/70 transition-colors hover:text-primary-500"
              >
                Close
              </button>
            </header>

            <div
              ref={scrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest("img")) close();
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="px-4 py-8 sm:px-6 md:py-12"
                >
                  <picture>
                    <source type="image/avif" srcSet={`${DIR}/${current.slug}.avif`} />
                    <img
                      src={`${DIR}/${current.slug}.webp`}
                      alt={`Newspaper clipping: ${current.headline}`}
                      width={current.width}
                      height={current.height}
                      decoding="async"
                      className="mx-auto h-auto bg-white"
                      style={{ width: `min(100%, ${Math.round(current.width * 1.4)}px, 1200px)` }}
                    />
                  </picture>
                </motion.div>
              </AnimatePresence>
            </div>

            <footer className="flex justify-between border-t border-white/10 px-4 py-3 text-sm sm:px-6 lg:px-10">
              <button
                type="button"
                onClick={() => step(-1)}
                className="text-white/70 transition-colors hover:text-primary-500"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="text-white/70 transition-colors hover:text-primary-500"
              >
                Next →
              </button>
            </footer>
          </div>
        )}
      </dialog>
    </>
  );
}

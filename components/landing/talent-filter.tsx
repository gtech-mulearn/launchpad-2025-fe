"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { filterSignals, talentFilter } from "./content";
import { EASE, Fade, RevealText, Rule, viewport } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Width of each layer as a share of the funnel's top edge. Each slice tapers from its
 * own width to the next one's, so the seven slices draw a single funnel.
 */
const WIDTHS = [100, 88, 76, 64, 52, 40, 28, 12];

/** Text that rolls vertically when its value changes: the old value exits up, the new one enters from below. */
function Roll({ value, className }: { value: string; className?: string }) {
  return (
    <span className={`relative block overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** The funnel. Layers already passed stay lit, the current one is orange, the rest are dim. */
function Funnel({ active }: { active: number }) {
  return (
    <motion.div
      aria-hidden
      className="flex w-full max-w-[30rem] flex-col items-center gap-1"
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
      transition={{ staggerChildren: 0.07 }}
    >
      {talentFilter.map((layer, i) => {
        const top = WIDTHS[i];
        const inset = ((top - WIDTHS[i + 1]) / 2 / top) * 100;
        const tone =
          i === active
            ? "bg-primary-500 text-ink"
            : i < active
              ? "bg-white/[0.16] text-white/80"
              : "bg-white/[0.06] text-white/40";
        return (
          <motion.div
            key={layer.name}
            className={`grid h-10 place-items-center text-sm font-medium transition-colors duration-500 md:h-11 ${tone}`}
            style={{
              width: `${top}%`,
              clipPath: `polygon(0 0, 100% 0, ${100 - inset}% 100%, ${inset}% 100%)`,
            }}
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              shown: { scaleX: 1, opacity: 1, transition: { duration: 1, ease: EASE } },
            }}
          >
            {layer.mark ?? layer.name}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function TalentFilter() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const total = talentFilter.length;

  // Which layer is being read, measured at the vertical middle of the viewport.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.55", "end 0.55"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(total - 1, Math.max(0, Math.floor(p * total))));
  });

  return (
    <section id="talent-filter" className="relative bg-ink py-24 text-white md:py-36">
      <Guides tone="dark" />

      <Container className="relative">
        <RevealText
          as="h2"
          text="How it works"
          className="text-5xl font-semibold tracking-[-0.05em] md:text-8xl"
        />

        <div className="mt-16 grid gap-x-6 gap-y-12 md:mt-24 md:grid-cols-4">
          <div className="self-start md:sticky md:top-10 md:col-span-2">
            <Eyebrow index="04" className="text-white/70">
              Talent filter
            </Eyebrow>
            <p className="mt-6 max-w-[22ch] text-2xl font-medium leading-tight tracking-[-0.03em] md:text-4xl">
              Every candidate comes through μLearn’s{" "}
              <span className="text-primary-500">seven-layer talent filter.</span>
            </p>

            <div className="mt-10 md:mt-14">
              <Funnel active={active} />
            </div>

            {/* Live layer counter, desktop only (the column is not sticky on phones). */}
            <div className="mt-6 hidden items-end gap-3 md:flex" aria-hidden>
              <Roll
                value={pad(active + 1)}
                className="text-5xl font-semibold leading-[0.85] tracking-[-0.05em] text-primary-500"
              />
              <span className="text-sm text-white/40">/ {pad(total)}</span>
              <Roll value={talentFilter[active].name} className="ml-2 text-sm font-medium" />
            </div>
          </div>

          <ol ref={listRef} className="md:col-span-2">
            {talentFilter.map((layer, i) => (
              <li
                key={layer.name}
                className={`transition-opacity duration-500 md:opacity-35 ${
                  i === active ? "md:!opacity-100" : ""
                }`}
              >
                <Rule className="text-white/15" />
                <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-8 md:py-10">
                  <span className="pt-2 text-xs text-white/40">{pad(i + 1)}</span>
                  <div>
                    <h3 className="flex items-baseline gap-3 text-2xl font-semibold tracking-[-0.03em] md:text-4xl">
                      {layer.name}
                      {layer.mark && <span className="text-primary-500">{layer.mark}</span>}
                    </h3>
                    {layer.traits ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {layer.traits.map((trait) => (
                          <li
                            key={trait}
                            className="border border-white/20 px-2.5 py-1 text-xs text-white/70"
                          >
                            {trait}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-white/60 md:text-base">
                        {layer.body}
                      </p>
                    )}
                    {/* On phones, each layer's width in the funnel stands in for the sticky graphic. */}
                    <span
                      aria-hidden
                      className="mt-5 block h-1 bg-primary-500 md:hidden"
                      style={{ width: `${WIDTHS[i]}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
            <Rule className="text-white/15" />
          </ol>
        </div>

        <div className="mt-24 grid gap-x-6 gap-y-10 md:mt-36 md:grid-cols-4">
          <div>
            <p className="text-xs text-white/50">On the platform</p>
            <RevealText
              as="h3"
              text="How μLearn applies the filter"
              className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-4xl"
            />
          </div>
          {filterSignals.map((signal, i) => (
            <Fade key={signal.title} delay={0.1 + i * 0.1}>
              <div className="border-t border-white/15 pt-5">
                <p className="text-xs text-primary-500">{pad(i + 1)}</p>
                <h4 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{signal.title}</h4>
                <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-white/60">
                  {signal.body}
                </p>
              </div>
            </Fade>
          ))}
        </div>
      </Container>
    </section>
  );
}

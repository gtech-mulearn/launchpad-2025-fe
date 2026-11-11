"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { process } from "./content";
import { EASE, RevealText, Rule } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");

function Meter({ step, total }: { step: number; total: number }) {
  return (
    <div className="mt-5 flex gap-1 md:hidden" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={i < step ? "h-1 w-6 bg-primary-500" : "h-1 w-6 bg-white/15"}
        />
      ))}
    </div>
  );
}

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

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const total = process.length;

  // Progress through the list, measured at the vertical middle of the viewport.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.55", "end 0.55"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(total - 1, Math.max(0, Math.floor(p * total))));
  });

  return (
    <section id="process" className="relative bg-ink py-24 text-white md:py-36">
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
              Process
            </Eyebrow>
            <p className="mt-6 max-w-[20ch] text-2xl font-medium leading-tight tracking-[-0.03em] md:text-4xl">
              From a posted role to a signed offer, in{" "}
              <span className="text-primary-500">six steps.</span>
            </p>

            {/* Live step counter, desktop only (the column is not sticky on phones). */}
            <div className="mt-16 hidden md:block" aria-hidden>
              <div className="flex items-end gap-3">
                <Roll
                  value={pad(active + 1)}
                  className="text-[7.5rem] font-semibold leading-[0.85] tracking-[-0.06em] text-primary-500"
                />
                <span className="pb-2 text-sm text-white/40">/ {pad(total)}</span>
              </div>
              <Roll value={process[active].title} className="mt-4 text-lg font-medium" />
              <div className="mt-5 h-px w-full max-w-xs bg-white/15">
                <motion.div
                  className="h-px origin-left bg-primary-500"
                  style={{ scaleX: fill }}
                />
              </div>
            </div>
          </div>

          <ol ref={listRef} className="md:col-span-2">
            {process.map((step, i) => (
              <li
                key={step.title}
                className={`transition-opacity duration-500 md:opacity-35 ${
                  i === active ? "md:!opacity-100" : ""
                }`}
              >
                <Rule className="text-white/15" />
                <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-7">
                  <span className="pt-1.5 text-xs text-white/40">{pad(i + 1)}</span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-white/60">
                      {step.body}
                    </p>
                    {step.points && (
                      <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                        {step.points.map((point) => (
                          <div key={point.label}>
                            <dt className="text-xs text-primary-500">{point.label}</dt>
                            <dd className="mt-1 text-sm leading-relaxed text-white/60">
                              {point.text}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <Meter step={i + 1} total={total} />
                  </div>
                </div>
              </li>
            ))}
            <Rule className="text-white/15" />
          </ol>
        </div>
      </Container>
    </section>
  );
}

"use client";

// Motion primitives for the landing page. Everything here is restrained on purpose:
// masked line reveals, hairlines that draw in, and a few scroll-linked effects.
// No bouncy springs, no blur-ins, no fade-everything-from-below.

import { useRef } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/** Long, soft "expo out" curve used for every reveal. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Wrap the page so every animation honours the OS reduced-motion setting. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * Splits text into words and slides each one up out of a clipping mask, staggered.
 * Use for headings. Words wrap naturally; each word gets its own mask.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = "span",
  onLoad = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  /** Animate on mount instead of when scrolled into view. */
  onLoad?: boolean;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  const trigger = onLoad
    ? { initial: "hidden", animate: "shown" }
    : { initial: "hidden", whileInView: "shown", viewport };

  return (
    <MotionTag
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      className={className}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "105%" },
              shown: { y: "0%", transition: { duration: 1.1, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * An inline list (e.g. company names) whose items slide up out of their masks in a
 * quick stagger when the list scrolls into view.
 */
export function RevealList({
  items,
  className,
  separator,
  stagger = 0.025,
}: {
  items: string[];
  className?: string;
  separator?: React.ReactNode;
  stagger?: number;
}) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
      transition={{ staggerChildren: stagger }}
    >
      {items.map((item, i) => (
        <li key={item} className="inline-block overflow-hidden whitespace-nowrap pb-[0.08em] -mb-[0.08em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "105%" },
              shown: { y: "0%", transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {item}
            {i < items.length - 1 && separator}
          </motion.span>
        </li>
      ))}
    </motion.ul>
  );
}

/** Slides a single block up out of a mask. Good for numbers and short labels. */
export function MaskUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  // The in-view trigger must sit on the mask, not the moving child: the child starts
  // fully clipped by the mask, so an observer on it would never report it as visible.
  return (
    <motion.span
      className={cn("block overflow-hidden", className)}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
    >
      <motion.span
        className="block will-change-transform"
        variants={{
          hidden: { y: "105%" },
          shown: { y: "0%", transition: { duration: 1.1, ease: EASE, delay } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * The hero wordmark. Letters rise out of one shared mask on load, then the whole word
 * drifts up a little slower than the page as you scroll away from it.
 */
export function Wordmark({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  return (
    <h1 ref={ref} className={cn("overflow-hidden pb-[0.06em] -mb-[0.06em]", className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        style={reduce ? undefined : { y }}
        initial="hidden"
        animate="shown"
        transition={{ staggerChildren: 0.045, delayChildren: 0.1 }}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%" },
              shown: { y: "0%", transition: { duration: 1.3, ease: EASE } },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </h1>
  );
}

/** A hairline that draws from left to right when it enters the viewport. */
export function Rule({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn("block h-px origin-left bg-current", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewport}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

/** Quiet fade for body copy: opacity plus a few pixels, nothing more. */
export function Fade({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function ScrubWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="transition-none">
      {word}{" "}
    </motion.span>
  );
}

/**
 * Paragraph whose words light up one by one as it scrolls through the viewport.
 * Falls back to plain text when reduced motion is requested.
 */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  if (reduce)
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => {
          const start = i / words.length;
          return (
            <ScrubWord
              key={i}
              word={word}
              progress={scrollYProgress}
              range={[start, start + 1 / words.length]}
            />
          );
        })}
      </span>
    </p>
  );
}

/**
 * Moves its children vertically relative to scroll while the element crosses the
 * viewport, from `from` to `to` (percent of its own height) over the `offset` range.
 */
export function Drift({
  children,
  className,
  from = "0%",
  to = "0%",
  offset = ["start end", "end start"],
}: {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  offset?: ScrollOffset;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

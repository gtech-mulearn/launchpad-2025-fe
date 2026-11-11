import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}

const guideTone = {
  light: "border-ink/[0.07]",
  dark: "border-white/[0.07]",
  orange: "border-ink/[0.12]",
};

/** Hairline column guides that run behind a section, aligned to the 4-column grid. */
export function Guides({ tone = "light" }: { tone?: keyof typeof guideTone }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Container className="grid h-full grid-cols-2 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-full border-l",
              guideTone[tone],
              i >= 2 && "hidden md:block",
              (i === 1 || i === 3) && "border-r md:border-r-0",
              i === 3 && "md:border-r"
            )}
          />
        ))}
      </Container>
    </div>
  );
}

/**
 * Classes for the full-bleed "LAUNCHPAD" wordmark. The font size is derived from the
 * container's inner width (viewport minus side padding, capped at 1440px) divided by the
 * word's measured width in ems (~5.6em), with a little slack for desktop scrollbars.
 */
export const wordmarkClass =
  "-ml-[0.05em] whitespace-nowrap font-semibold uppercase leading-[0.8] tracking-[-0.065em] " +
  "text-[length:calc((100vw_-_2rem)/5.75)] sm:text-[length:calc((100vw_-_3rem)/5.75)] " +
  "lg:text-[length:min(calc((100vw_-_5rem)/5.75),14.75rem)]";

export function Eyebrow({
  index,
  children,
  className,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("flex items-baseline gap-3 text-xs", className)}>
      <span className="opacity-50">{index}</span>
      <span>{children}</span>
    </p>
  );
}

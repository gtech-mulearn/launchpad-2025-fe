import { Plus } from "lucide-react";
import { benefits } from "./content";
import { Fade, RevealText } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

function BenefitList({
  heading,
  items,
  offset,
}: {
  heading: string;
  items: { title: string; body: string }[];
  offset: number;
}) {
  return (
    <div>
      <p className="mb-4 text-xs text-ink/50">{heading}</p>
      <div className="border-b border-ink/15">
        {items.map((item, i) => (
          <details key={item.title} className="lp-details group border-t border-ink/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
              <span className="flex items-baseline gap-5">
                <span className="w-5 text-xs text-ink/40">
                  0{offset + i + 1}
                </span>
                <span className="text-xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-primary-600 md:text-2xl">
                  {item.title}
                </span>
              </span>
              <Plus
                className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
                strokeWidth={1.5}
              />
            </summary>
            <p className="max-w-[46ch] pb-6 pl-10 text-sm leading-relaxed text-ink/60">
              {item.body}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function Benefits() {
  return (
    <section id="benefits" className="relative bg-paper py-24 md:py-36">
      <Guides />

      <Container className="relative">
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Eyebrow index="05">Benefits</Eyebrow>
            <h2 className="mt-6 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
              <RevealText text="Both sides" className="block" />
              <RevealText text="of the table" className="block" delay={0.12} />
            </h2>
          </div>
          <Fade delay={0.2} className="self-end md:col-span-2">
            <p className="max-w-[30ch] text-lg font-medium leading-snug tracking-[-0.01em] md:text-xl">
              Launchpad Kerala 2025 offers distinct advantages for the companies
              hiring and for the students being hired.
            </p>
          </Fade>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-14 md:mt-24 md:grid-cols-2">
          <Fade>
            <BenefitList heading="For recruiters" items={benefits.recruiters} offset={0} />
          </Fade>
          <Fade delay={0.15}>
            <BenefitList
              heading="For students"
              items={benefits.students}
              offset={benefits.recruiters.length}
            />
          </Fade>
        </div>
      </Container>
    </section>
  );
}

import { recruiters2024 } from "./content";
import { Fade, RevealList, RevealText, Rule } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

export function Recruiters() {
  return (
    <section id="recruiters" className="relative bg-primary-500 py-24 text-ink md:py-36">
      <Guides tone="orange" />

      <Container className="relative">
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-4">
          <div className="md:col-span-3">
            <Eyebrow index="07">Recruiters</Eyebrow>
            <RevealText
              as="h2"
              text="Last year’s recruiters"
              className="mt-6 text-5xl font-semibold tracking-[-0.05em] md:text-7xl"
            />
          </div>
          <Fade delay={0.2} className="self-end">
            <p className="text-sm leading-snug">
              Companies that hired at Launchpad Kerala 2024.{" "}
              <span className="text-ink/60">More are joining for 2025.</span>
            </p>
          </Fade>
        </div>

        <Rule className="mt-16 text-ink md:mt-24" />
        <RevealList
          items={recruiters2024}
          className="pt-8 text-2xl font-semibold leading-[1.3] tracking-[-0.03em] md:text-4xl"
          separator={<span className="px-2.5 font-normal text-ink/30 md:px-3.5">/</span>}
        />
      </Container>
    </section>
  );
}

import { stats } from "./content";
import { Fade, MaskUp, Rule, ScrubText } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-4 bg-paper py-24 md:py-36">
      <Guides />

      <Container className="relative grid gap-x-6 gap-y-12 md:grid-cols-4">
        <div className="md:col-span-3">
          <Eyebrow index="01">About</Eyebrow>
          <ScrubText
            className="mt-6 max-w-[21ch] text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl"
            text="Launchpad Kerala 2025 connects skilled people with companies looking for verified, work-ready talent."
          />
        </div>

        <div className="grid gap-6 text-sm leading-relaxed text-ink/60 sm:grid-cols-2 md:col-span-2 md:col-start-3">
          <Fade>
            <p>
              An initiative of the IEEE Kerala Section, organised by the μLearn
              Foundation and IEEE in association with KDISC and GTech. Launchpad
              bridges the gap between what industry needs and the people who can
              deliver it, opening pathways for growth across Kerala’s job market.
            </p>
          </Fade>
          <Fade delay={0.12}>
            <p>
              A skills-first approach, flexible interviews and a wide talent pool
              make it a strong opportunity for candidates and employers alike.
            </p>
          </Fade>
        </div>
      </Container>

      <Container className="relative mt-24 md:mt-32">
        <Rule className="text-ink" />
        <dl className="grid grid-cols-3">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex flex-col-reverse pr-4 pt-4">
              <dt className="mt-1 text-xs text-ink/50">
                <MaskUp delay={0.25 + i * 0.12}>{stat.label}</MaskUp>
              </dt>
              <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                <MaskUp delay={0.15 + i * 0.12}>{stat.value}</MaskUp>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

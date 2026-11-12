import { editions2024, press } from "./content";
import { Fade, MaskUp, RevealText, Rule } from "./motion";
import { PressWall } from "./press-wall";
import { Container, Eyebrow, Guides } from "./primitives";

const pad = (n: number) => String(n).padStart(2, "0");

export function News() {
  return (
    <section id="news" className="relative border-t border-ink/10 bg-paper py-24 md:py-36">
      <Guides />

      <Container className="relative">
        <div className="grid items-end gap-6 pb-10 md:grid-cols-4 md:pb-14">
          <Eyebrow index="06">News</Eyebrow>
          <RevealText
            as="h2"
            text="From the 2024 edition"
            className="text-5xl font-semibold tracking-[-0.05em] md:col-span-2 md:text-7xl"
          />
          <p className="text-xs text-ink/50 md:text-right">
            {editions2024.length} fairs · {editions2024.map((e) => e.city).join(" and ")}
          </p>
        </div>

        <ol>
          {editions2024.map((edition, i) => (
            <li key={edition.city}>
              <Rule className="text-ink/15" />
              <article className="grid gap-x-6 gap-y-8 py-10 md:grid-cols-4 md:py-16">
                <div className="flex justify-between gap-4 md:block">
                  <span className="text-xs text-ink/40">{pad(i + 1)}</span>
                  <Fade delay={0.1} className="text-right md:mt-6 md:text-left">
                    <time dateTime={edition.dateTime} className="block text-sm font-medium">
                      {edition.date}
                    </time>
                    <p className="mt-1 max-w-[26ch] text-xs leading-relaxed text-ink/50 md:max-w-[22ch]">
                      {edition.venue}
                    </p>
                  </Fade>
                </div>

                <div className="md:col-span-2">
                  <RevealText
                    as="h3"
                    text={edition.city}
                    delay={0.05}
                    className="text-6xl font-semibold leading-[0.9] tracking-[-0.055em] md:text-8xl"
                  />
                  <Fade delay={0.2}>
                    <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-ink/70 md:mt-8 md:text-lg">
                      {edition.summary}
                    </p>
                  </Fade>
                </div>

                <div>
                  <dl className="grid grid-cols-3 gap-x-4 border-b border-ink/15 md:grid-cols-1">
                    {edition.stats.map((stat, j) => (
                      <div
                        key={stat.label}
                        className="flex flex-col-reverse justify-end border-t border-ink/15 py-3"
                      >
                        <dt className="mt-1 text-xs text-ink/50">{stat.label}</dt>
                        <dd className="text-3xl font-semibold leading-none tracking-[-0.04em] md:text-5xl">
                          <MaskUp delay={0.2 + j * 0.1}>{stat.value}</MaskUp>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <Fade delay={0.3}>
                    <p className="mt-6 text-xs text-ink/50">Among the companies</p>
                    <p className="mt-1 text-sm leading-relaxed">{edition.companies.join(", ")}</p>
                  </Fade>
                </div>
              </article>
            </li>
          ))}
          <Rule className="text-ink/15" />
        </ol>
      </Container>

      <Container className="relative mt-24 md:mt-36">
        <div className="grid items-end gap-6 pb-10 md:grid-cols-4 md:pb-14">
          <p className="text-xs text-ink/50">In the media</p>
          <RevealText
            as="h3"
            text="What the media said"
            className="text-4xl font-semibold tracking-[-0.045em] md:col-span-2 md:text-6xl"
          />
        </div>
        <PressWall items={press} />
      </Container>
    </section>
  );
}

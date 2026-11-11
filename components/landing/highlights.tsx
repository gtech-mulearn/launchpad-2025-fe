import { highlights } from "./content";
import { Fade, RevealText, Rule } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

export function Highlights() {
  return (
    <section id="highlights" className="relative bg-paper pb-24 md:pb-36">
      <Guides />

      <Container className="relative">
        <div className="grid items-end gap-6 pb-10 md:grid-cols-4 md:pb-14">
          <Eyebrow index="03">Highlights</Eyebrow>
          <RevealText
            as="h2"
            text="What sets it apart"
            className="text-5xl font-semibold tracking-[-0.05em] md:col-span-2 md:text-7xl"
          />
          <p className="text-xs text-ink/50 md:text-right">Compared with other job fairs</p>
        </div>

        <ol>
          {highlights.map((item, i) => (
            <li key={item.title} className="group relative">
              <Rule className="text-ink/15" />
              <div className="grid gap-x-6 gap-y-3 py-8 md:grid-cols-4 md:py-12">
                <span className="text-xs text-ink/40">0{i + 1}</span>
                <RevealText
                  as="h3"
                  text={item.title}
                  delay={0.1}
                  className="text-3xl font-semibold leading-none tracking-[-0.04em] transition-colors duration-300 group-hover:text-primary-600 md:col-span-2 md:text-5xl"
                />
                <Fade delay={0.25}>
                  <p className="max-w-[44ch] text-sm leading-relaxed text-ink/60">{item.body}</p>
                </Fade>
              </div>
            </li>
          ))}
          <Rule className="text-ink/15" />
        </ol>
      </Container>
    </section>
  );
}

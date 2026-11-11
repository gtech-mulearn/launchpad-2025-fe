import { cities, nav } from "./content";
import { Container, Guides, wordmarkClass } from "./primitives";
import { Fade, MaskUp, Rule, Wordmark } from "./motion";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper">
      <Guides />

      <Container className="relative">
        <Fade delay={0.7}>
        <header className="grid grid-cols-2 gap-x-4 gap-y-3 pb-12 pt-5 text-xs leading-snug md:grid-cols-4 md:pb-20">
          <a href="#top" className="text-sm font-semibold tracking-tight">
            Launchpad<span className="text-primary-500">.</span>
          </a>
          <p className="text-ink/50">
            Organised by μLearn Foundation &amp; IEEE
            <br />
            <span className="text-ink">Kerala, India</span>
          </p>
          <nav className="col-span-2 flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="underline-offset-4 transition-colors hover:text-primary-600 hover:underline"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>
        </Fade>

        <Wordmark text="Launchpad" className={wordmarkClass} />

        <Rule className="mt-6 text-ink" delay={0.5} />
        <div className="grid grid-cols-2 gap-4 pb-10 pt-3 md:grid-cols-4 md:pb-14">
          <div className="max-w-[26ch] text-sm leading-snug text-ink/60 md:col-span-2">
            <MaskUp delay={0.75}>
              A job fair connecting talent in software, creative and management
              with leading companies across diverse industries.
            </MaskUp>
          </div>
          <div className="text-right md:col-span-2">
            <MaskUp delay={0.85}>
              <span className="block text-2xl font-semibold tracking-[-0.04em] text-primary-600 md:text-4xl">
                Kerala ’25
              </span>
            </MaskUp>
            <MaskUp delay={0.95}>
              <span className="text-xs text-ink/50">Job fair edition</span>
            </MaskUp>
          </div>
        </div>
      </Container>

      <div className="bg-primary-500 text-ink">
        <Container className="grid sm:grid-cols-3">
          {cities.map((city, i) => (
            <div
              key={city.name}
              className="flex min-h-[8.5rem] flex-col justify-between gap-6 border-t border-ink/15 py-5 first:border-t-0 sm:min-h-[22rem] sm:border-l sm:border-t-0 sm:px-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <p className="flex justify-between text-xs">
                <span>{i === 0 ? "Interviews held in" : " "}</span>
                <span>0{i + 1}</span>
              </p>
              <div>
                <MaskUp delay={0.15 * i}>
                  <span className="block pb-[0.06em] text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
                    {city.name}
                  </span>
                </MaskUp>
                <MaskUp delay={0.15 * i + 0.1}>
                  <span className="mt-2 block text-xs text-ink/60">{city.coords}</span>
                </MaskUp>
              </div>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
}

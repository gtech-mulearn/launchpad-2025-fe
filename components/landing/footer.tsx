import { cities, nav, partners } from "./content";
import { Drift } from "./motion";
import { Container, Guides, wordmarkClass } from "./primitives";

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-20 text-white md:pt-28">
      <Guides tone="dark" />

      <Container className="relative">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <img
              src="/images/logo.webp"
              alt="Launchpad Kerala"
              className="h-7 w-auto"
            />
            <p className="mt-5 max-w-[30ch] text-sm leading-relaxed text-white/50">
              A job fair connecting talent in software, creative and management
              with leading companies across diverse industries.
            </p>
          </div>

          <div>
            <p className="text-xs text-white/40">Sections</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-primary-500">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs text-white/40">Interviews</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {cities.map((city) => (
                <li key={city.name}>{city.name}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-white/40">Partners</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              {partners.map((p) => (
                <li key={p.name}>{p.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-3 border-t border-white/15 py-5 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Launchpad Kerala · μLearn Foundation</p>
          <a href="#top" className="transition-colors hover:text-white">
            Back to top ↑
          </a>
        </div>
      </Container>

      <Container className="relative">
        <Drift from="65%" to="0%" offset={["start end", "end end"]}>
          <p aria-hidden className={`${wordmarkClass} -mb-[0.07em] select-none text-primary-500`}>
            Launchpad
          </p>
        </Drift>
      </Container>
    </footer>
  );
}

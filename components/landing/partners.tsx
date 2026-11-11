import { cities, partners } from "./content";
import { Fade, MaskUp, RevealText } from "./motion";
import { Container, Eyebrow, Guides } from "./primitives";

const counts = [
  { label: "Partner organisations", value: partners.length },
  { label: "Interview cities", value: cities.length },
  { label: "Talent tracks", value: 3, note: "Software, creative, management" },
];

export function Partners() {
  return (
    <section id="partners" className="relative bg-white py-24 md:py-36">
      <Guides />

      <Container className="relative">
        <Eyebrow index="08">Partners</Eyebrow>
        <h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-7xl">
          <RevealText text="Powered by a network" className="block" />
          <RevealText text="of partners." className="block text-ink/35" delay={0.15} />
        </h2>

        <div className="mt-16 grid gap-x-6 gap-y-16 md:mt-24 md:grid-cols-4">
          <Fade className="self-start md:col-span-2">
          <ul className="border-b border-ink/15">
            {partners.map((partner) => (
              <li key={partner.name} className="border-t border-ink/15">
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[8.5rem_1fr_auto] gap-4 py-4 sm:grid-cols-[10rem_1fr_auto]"
                >
                  <span className="pt-0.5 text-xs text-ink/50">{partner.role}</span>
                  <span className="font-medium transition-colors group-hover:text-primary-600">
                    {partner.name}
                  </span>
                  <span
                    aria-hidden
                    className="text-ink/30 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-600"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
          </Fade>

          <Fade delay={0.15} className="md:col-span-2">
            <p className="max-w-[48ch] text-sm leading-relaxed text-ink/60">
              The collaboration brings together industry expertise, academic reach
              and community-driven talent development. Companies find job-ready
              candidates, candidates get to show verified skills, and Launchpad
              stays skills-first, inclusive and useful to both.
            </p>

            <dl className="mt-12 border-b border-ink/15">
              {counts.map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-end justify-between gap-6 border-t border-ink/15 py-4"
                >
                  <dt className="text-sm">
                    {item.label}
                    {item.note && (
                      <span className="block text-xs text-ink/50">{item.note}</span>
                    )}
                  </dt>
                  <dd className="text-4xl font-semibold leading-none tracking-[-0.04em]">
                    <MaskUp delay={0.3 + i * 0.1}>{item.value}</MaskUp>
                  </dd>
                </div>
              ))}
            </dl>
          </Fade>
        </div>
      </Container>
    </section>
  );
}

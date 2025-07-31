import Image from "next/image";

export function PartnershipsSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1">
              <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">
                Partnerships
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 uppercase tracking-tighter leading-tight">
              Strategic <span className="text-primary-500">Partnerships</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed text-justify">
                Launchpad Kerala 2025 is powered by a strong network of partners
                — the μLearn Foundation, IEEE Kerala Section, GTech, the Kerala
                Development and Innovation Strategic Council and the Kerala
                Knowledge Economy Mission — working together to connect skilled
                youth with real opportunities.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed text-justify">
                This collaboration combines industry expertise, academic reach,
                and community-driven talent development to help companies find
                job-ready candidates and help candidates showcase verified
                skills. Together, these partners ensure Launchpad stays
                skills-first, inclusive, and impactful for both employers and
                job seekers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-scale-in delay-300">
            {[
              {
                name: "MuLearn Foundation",
                abbr: "Mulearn",
                link: "https://mulearn.org",
                icon: "https://mulearn.org/favicon.ico",
              },
              {
                name: "Kerala Knowledge Economy Mission",
                abbr: "KKEM",
                link: "https://knowledgemission.kerala.gov.in",
                icon: "/images/kkem.png",
              },
              {
                name: "IEEE",
                abbr: "IEEE",
                link: "https://ieeekerala.org",
                icon: "https://ieeekerala.org/wp-content/uploads/2024/05/cropped-sectionLogoBlue.png",
              },
            ].map((partner, index) => (
              <div
                key={index}
                className="aspect-square flex flex-col items-center justify-center border border-primary-500/20 hover:border-primary-500 transition-all duration-300 p-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-fit h-16 flex items-center justify-center border-2 border-primary-500 mb-4">
                  <span className="text-xl font-bold text-primary-500">
                   <a
                   href={partner.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   >
                     <Image
                       src={partner.icon}
                       alt={`${partner.name} Logo`}
                       width={64}
                       height={64}
                       className="h-16 w-auto object-contain mix-blend-color-burn p-1"
                     />
                   </a>
                  </span>
                </div>
                <p className="text-sm text-center text-secondary-900">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

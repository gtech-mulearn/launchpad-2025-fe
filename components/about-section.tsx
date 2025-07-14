import { ScrollReveal } from "./scroll-reveal"

export function AboutSection() {
  return (
    <section id="about" className="w-full py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left" duration={800}>
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">About</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 uppercase tracking-tighter leading-tight">
                What is <span className="text-primary-500">Launchpad</span> Kerala?
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 text-lg leading-relaxed text-justify">
                  Launchpad Kerala 2025 is a premier job fair that brings together talented individuals and innovative
                  companies in the technical and engineering fields. MuLearn Foundation aims to create meaningful connections that drive progress and innovation in Kerala's job
                  market.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed text-justify">
                  Through a unique assessment approach, flexible interview locations, and a comprehensive talent pool,
                  Launchpad Kerala 2025 offers unparalleled opportunities for both candidates and companies.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={300} duration={800}>
            <div className="aspect-square w-full max-w-md mx-auto relative">
              {/* Geometric elements */}
              <div className="absolute top-0 left-0 w-full h-full border-2 border-primary-500 transform translate-x-4 translate-y-4"></div>

              <div className="absolute inset-0 bg-secondary-900 flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="border border-primary-500/30 p-4 hover:border-primary-500 transition-all duration-300">
                    <p className="text-xs uppercase tracking-widest text-primary-400">Organized by</p>
                  </div>
                  <div className="border border-primary-500/30 p-4 hover:border-primary-500 transition-all duration-300">
                    <p className="font-bold text-white mt-1">MuLearn Foundation</p>
                  </div>
                  <div className="border border-primary-500/30 p-4 hover:border-primary-500 transition-all duration-300">
                    <p className="text-xs uppercase tracking-widest text-primary-400">Supported by</p>
                    <p className="font-bold text-white mt-1">Kerala Knowledge Economy Mission</p>
                  </div>
                  <div className="border border-primary-500/30 p-4 hover:border-primary-500 transition-all duration-300">
                    <p className="text-xs uppercase tracking-widest text-primary-400">For</p>
                    <p className="font-bold text-white mt-1">Students & Graduates</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

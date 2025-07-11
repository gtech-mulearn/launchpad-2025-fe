export function PartnershipsSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1">
              <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">Partnerships</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 uppercase tracking-tighter leading-tight">
              Strategic <span className="text-primary-500">Partnerships</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-lg leading-relaxed text-justify">
                The collaboration between IEEE Kerala Section and GTech MuLearn for Launchpad Kerala enhances its
                impact, offering a premier job fair experience.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed text-justify">
                This partnership ensures candidates undergo a thorough assessment, while companies gain access to top
                talent and increased brand visibility. Together, these organizations bring their expertise and networks
                to create a platform that benefits both job seekers and employers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-scale-in delay-300">
            {[
              { name: "IEEE Kerala Section", abbr: "IEEE" },
              { name: "IEEE LINK", abbr: "LINK" },
              { name: "MuLearn Foundation", abbr: "Mulearn" },
              { name: "Kerala Knowledge Economy Mission", abbr: "KKEM" },
            ].map((partner, index) => (
              <div
                key={index}
                className="aspect-square flex flex-col items-center justify-center border border-primary-500/20 hover:border-primary-500 transition-all duration-300 p-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 flex items-center justify-center border-2 border-primary-500 mb-4">
                  <span className="text-xl font-bold text-primary-500">{partner.abbr}</span>
                </div>
                <p className="text-sm text-center text-secondary-900">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

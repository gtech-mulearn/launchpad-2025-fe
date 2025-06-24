import { Target, MapPin, Users } from "lucide-react"

export function HighlightsSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-secondary-900 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1 mx-auto">
              <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">Highlights</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-tight">
              Launchpad Kerala <span className="text-primary-500">Highlights</span>
            </h2>
            <p className="text-gray-400 text-lg ">What makes Launchpad Kerala 2025 stand out from other job fairs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 w-full">
            <div className="bg-secondary-800 border border-primary-500/20 p-8 hover:border-primary-500 transition-all duration-300 animate-slide-in-left">
              <div className="flex flex-col items-start text-left space-y-4">
                <Target className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Unique Assessment Approach</h3>
                <div className="w-12 h-0.5 bg-primary-500"></div>
                <p className="text-gray-400 text-justify">
                  Launchpad Kerala 2025's standout assessment process includes a rigorous technical challenge and online
                  tests. This approach evaluates technical and non-technical skills, ensuring only the best candidates
                  proceed to interviews.
                </p>
              </div>
            </div>

            <div className="bg-secondary-800 border border-primary-500/20 p-8 hover:border-primary-500 transition-all duration-300 animate-slide-in-left delay-200">
              <div className="flex flex-col items-start text-left space-y-4">
                <MapPin className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Flexible Interview Locations</h3>
                <div className="w-12 h-0.5 bg-primary-500 "></div>
                <p className="text-gray-400 text-justify">
                  Shortlisted candidates for Launchpad Kerala 2025 can opt for interviews in Trivandrum, Kochi, or
                  Kozhikode, streamlining the hiring process for companies and maximizing participation from top talent.
                </p>
              </div>
            </div>

            <div className="bg-secondary-800 border border-primary-500/20 p-8 hover:border-primary-500 transition-all duration-300 animate-slide-in-left delay-400">
              <div className="flex flex-col items-start text-left space-y-4">
                <Users className="h-8 w-8 text-primary-500" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Comprehensive Talent Pool</h3>
                <div className="w-12 h-0.5 bg-primary-500"></div>
                <p className="text-gray-400 text-justify">
                  Launchpad Kerala 2025 boasts a diverse talent pool sourced from across Kerala, catering to various
                  skill sets and experience levels, providing companies with access to top-tier candidates for a
                  multitude of roles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { ScrollReveal } from "./scroll-reveal"
import { StaggerContainer } from "./stagger-container"

export function ProcessSection() {
  const processSteps = [
    {
      step: 1,
      title: "Participant Registration",
      description:
        "Students and recent graduates register for the event through the official website, providing their educational background, skills, and career interests.",
      icon: "👥",
      color: "from-blue-500 to-blue-600",
    },
    {
      step: 2,
      title: "Company Registration Close",
      description:
        "Companies finalize their participation and submit their job requirements and specifications for the positions they're looking to fill.",
      icon: "🏢",
      color: "from-green-500 to-green-600",
    },
    {
      step: 3,
      title: "Challenge Start",
      description:
        "Registered participants begin the technical challenge phase, working on real-world problems to demonstrate their skills and problem-solving abilities.",
      icon: "⚡",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      step: 4,
      title: "Online Exam",
      description:
        "Participants take an online assessment that evaluates their technical knowledge, aptitude, and problem-solving skills relevant to their field of interest.",
      icon: "📝",
      color: "from-purple-500 to-purple-600",
    },
    {
      step: 5,
      title: "Consolidated Rank List",
      description:
        "Based on the challenge and online exam results, a consolidated rank list is prepared, identifying the top performers who will proceed to the next stage.",
      icon: "📊",
      color: "from-red-500 to-red-600",
    },
    {
      step: 6,
      title: "Option Selection",
      description:
        "Shortlisted candidates select their preferred companies and interview locations (Trivandrum, Kochi, or Kozhikode) based on their interests and convenience.",
      icon: "🎯",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      step: 7,
      title: "Confirmed Mail to Selected Participants",
      description:
        "Selected candidates receive confirmation emails with details about their interview schedule, location, and any preparation materials or instructions.",
      icon: "✉️",
      color: "from-pink-500 to-pink-600",
    },
    {
      step: 8,
      title: "Interviews",
      description:
        "Candidates attend interviews with their chosen companies at their selected locations, where they have the opportunity to showcase their skills and learn more about potential employers.",
      icon: "🤝",
      color: "from-teal-500 to-teal-600",
    },
  ]

  return (
    <section id="process" className="w-full py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <ScrollReveal direction="up" duration={800}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1 mx-auto mb-6">
              <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 uppercase tracking-tighter mb-4">
              Launchpad Kerala 2025 <span className="text-primary-500">Process</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A comprehensive step-by-step guide to our innovative recruitment process
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-6xl mx-auto">
          <StaggerContainer staggerDelay={150}>
            {processSteps.map((item, index) => (
              <div
                key={item.step}
                className={`relative mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex flex-col md:flex md:items-center md:justify-between group`}
              >
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute left-8 md:left-1/2 top-20 md:top-auto md:bottom-0 w-px md:w-full md:h-px h-12 md:transform md:-translate-x-1/2 md:translate-y-8 bg-gradient-to-b md:bg-gradient-to-r from-primary-500/60 to-primary-500/20"></div>
                )}

                {/* Step Number Circle */}
                <div className="relative z-10 flex md:absolute md:left-1/2 md:transform md:-translate-x-1/2 items-center mb-6 md:mb-0">
                  
                </div>

                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"} md:w-5/12`}>
                  <div className="bg-white border border-primary-500/20 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-primary-500/40 transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
                    {/* Icon and Title */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-secondary-900 uppercase tracking-tight">{item.title}</h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mt-2"></div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>

                    {/* Progress Indicator */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">
                        Step {item.step} of {processSteps.length}
                      </span>
                      <div className="flex space-x-1">
                        {Array.from({ length: processSteps.length }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              i < item.step ? "bg-primary-500" : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-5/12"></div>
              </div>
            ))}
          </StaggerContainer>
        </div>

        {/* Call to Action */}
        <ScrollReveal direction="up" delay={800} duration={800}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4 uppercase tracking-tight">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of talented individuals and innovative companies in Launchpad Kerala 2025
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105">
                  Register as Candidate
                </button>
                <button className="bg-transparent hover:bg-primary-500/10 text-primary-500 border border-primary-500 px-8 py-3 rounded-lg font-medium uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105">
                  Register as Company
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function BenefitsSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-secondary-900 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1 mx-auto">
              <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">Benefits</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-tight">
              Benefits for <span className="text-primary-500">All</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Launchpad Kerala 2025 offers unique advantages for both recruiters and students
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto animate-scale-in delay-300">
            <Tabs defaultValue="recruiters" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-transparent border border-primary-500">
                <TabsTrigger
                  value="recruiters"
                  className="text-white data-[state=active]:bg-primary-500 data-[state=active]:text-white transition-all duration-300 uppercase tracking-widest text-xs font-medium py-3"
                >
                  For Recruiters
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="text-white data-[state=active]:bg-primary-500 data-[state=active]:text-white transition-all duration-300 uppercase tracking-widest text-xs font-medium py-3"
                >
                  For Students
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recruiters" className="mt-12">
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Enhanced Brand Visibility",
                      description:
                        "Stand out among competitors by showcasing your brand's ethos and career opportunities to top talent, solidifying your position as an employer of choice in the industry.",
                    },
                    {
                      title: "Cost-Efficient Recruitment Solutions",
                      description:
                        "Slash recruitment costs and streamline your hiring process, ensuring optimal resource allocation while accessing the best talent Kerala has to offer.",
                    },
                    {
                      title: "Access to Elite Talent",
                      description:
                        "Tap into a diverse pool of top-tier professionals, graduates, and emerging stars, equipping your organization with the skills and expertise needed for sustainable growth and innovation.",
                    },
                    {
                      title: "Talent Pipeline Enrichment",
                      description:
                        "Cultivate a future-ready workforce by nurturing relationships with promising candidates, offering internships, and fostering professional development initiatives.",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="border border-primary-500/20 hover:border-primary-500 transition-all duration-300 p-8"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col items-start text-left space-y-4">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{benefit.title}</h3>
                        <div className="w-12 h-0.5 bg-primary-500"></div>
                        <p className="text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="students" className="mt-12">
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Networking Opportunities",
                      description:
                        "Students have the chance to network with professionals and representatives from a variety of innovative companies. This allows them to establish valuable connections for potential internships, co-op opportunities, and future employment.",
                    },
                    {
                      title: "Access to Industry Insights",
                      description:
                        "Attending the job fair gives students exposure to the latest trends, technologies, and challenges in their field. They can gain insights into industry best practices, upcoming projects, and the skills in demand.",
                    },
                    {
                      title: "Exposure to Diverse Career Paths",
                      description:
                        "Launchpad Kerala features a wide range of companies across different sectors and industries, exposing students to diverse career paths they may not have considered before.",
                    },
                    {
                      title: "Personal Development",
                      description:
                        "Participating in Launchpad Kerala 2025 offers students a transformative experience, fostering personal growth and development. Through the assessment process, students push their limits and cultivate resilience.",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="border border-primary-500/20 hover:border-primary-500 transition-all duration-300 p-8"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col items-start text-left space-y-4">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{benefit.title}</h3>
                        <div className="w-12 h-0.5 bg-primary-500"></div>
                        <p className="text-gray-400">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

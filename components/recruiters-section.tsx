"use client";
import { useGetVerifiedCompany } from "@/hooks/api";

export function RecruitersSection() {
  const { data: verifiedCompanies } = useGetVerifiedCompany();
  return (
    <section
      id="recruiters"
      className="w-full py-24 md:py-32 bg-secondary-900 relative overflow-hidden"
    >
      {/* Grid overlay */}

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1 mx-auto">
              <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">
                Recruiters
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-tight">
              Last Year's <span className="text-primary-500">Recruiters</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Meet the companies who participated in Launchpad Kerala 2024
            </p>
          </div>

          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                "Abilytics",
                "TATA Elxsi",
                "Benlycos",
                "Bluecast",
                "CareStack",
                "Cubet",
                "Faith Infotech Academy",
                "Kott Software",
                "PumexInfotech",
                "STPL",
                "Terveys",
                "amdrodo",
                "Codelinks",
                "Expertzlab",
                "Faya",
                "Normality",
                "Pearlsoft",
                "Plusit",
                "toobler",
                "Innoneur",
                "open",
                "software incubator",
                "cabot",
                "curate",
                "equip",
                "Fostering",
                "Ibil",
                "Kennedys",
                "QWY Soft",
              ].map((company, index) => (
                <div
                  key={index}
                  className="border border-primary-500/20 hover:border-primary-500 transition-all duration-300 p-4 flex items-center justify-center h-16 animate-scale-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <p className="font-medium text-center text-white text-sm uppercase tracking-wider">
                    {company}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {verifiedCompanies && (
            <>
              <div className="space-y-6 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-tight">
                  Currently Registered
                  <span className="text-primary-500">Recruiters</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Meet the companies who are registered for Launchpad Kerala
                  2025
                </p>
              </div>

              <div className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {verifiedCompanies.map((company, index) => (
                    <div
                      key={index}
                      className="border border-primary-500/20 hover:border-primary-500 transition-all duration-300 p-4 flex items-center justify-center h-full animate-scale-in"
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <a
                        href={company.website}
                        className="font-medium text-center text-white text-sm uppercase tracking-wider"
                      >
                        {company.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="inline-flex items-center space-x-2 border border-primary-500 px-4 py-2 animate-bounce-in delay-1000">
            <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">
              More companies joining soon!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

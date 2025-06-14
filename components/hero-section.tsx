import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { CursiveAnimation } from "./cursive-animation"
import { GlitchText } from "./glitch-text"
import { ScrollReveal } from "./scroll-reveal"
import { StaggerContainer } from "./stagger-container"

export function HeroSection() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-secondary-900 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>

      {/* Accent lines */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-primary-500/20"></div>
      <div className="absolute top-0 left-1/2 w-px h-full bg-primary-500/20"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <StaggerContainer staggerDelay={200}>
              <div className="inline-flex items-center space-x-2 border border-primary-500 px-3 py-1">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-medium">
                  Premier Job Fair 2025
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold text-white uppercase tracking-tighter leading-none">
                <GlitchText text="Launch" className="text-white" triggerOnHover />
                <span className="text-primary-500">pad</span> <br />
                <CursiveAnimation text="Kerala" className="text-6xl sm:text-8xl" speed={150} /> 2025
              </h1>

              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                A premier job fair connecting talented individuals with innovative companies in the technical and
                engineering fields.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary-500 hover:bg-primary-600 text-white border-0 transition-all duration-300 group uppercase tracking-widest text-sm font-medium hover:scale-105"
                >
                  <Link href="/register">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="bg-transparent hover:bg-transparent text-white border border-white/20 hover:border-white/40 transition-all duration-300 uppercase tracking-widest text-sm font-medium hover:scale-105"
                >
                  <Link href="#about">Learn More</Link>
                </Button>
              </div>
            </StaggerContainer>
          </div>

          <ScrollReveal direction="scale" delay={600} duration={1000}>
            <div className="aspect-square w-full max-w-lg mx-auto relative">
              {/* Geometric elements */}
              <div className="absolute top-0 left-0 w-2/3 h-2/3 border-l-2 border-t-2 border-primary-500 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 border-r-2 border-b-2 border-primary-500 animate-pulse"></div>

              {/* Stats */}
              <div className="absolute inset-0 flex items-center justify-center">
                <StaggerContainer staggerDelay={150}>
                  <div className="bg-secondary-800 border border-primary-500/20 p-6 transition-all duration-300 hover:border-primary-500 hover:scale-105 group">
                    <p className="text-5xl font-bold text-primary-500 group-hover:animate-pulse">30+</p>
                    <p className="text-xs uppercase tracking-widest text-white mt-2">Companies</p>
                  </div>
                  <div className="bg-secondary-800 border border-primary-500/20 p-6 transition-all duration-300 hover:border-primary-500 hover:scale-105 group">
                    <p className="text-5xl font-bold text-primary-500 group-hover:animate-pulse">100+</p>
                    <p className="text-xs uppercase tracking-widest text-white mt-2">Opportunities</p>
                  </div>
                  <div className="bg-secondary-800 border border-primary-500/20 p-6 transition-all duration-300 hover:border-primary-500 hover:scale-105 group">
                    <p className="text-5xl font-bold text-primary-500 group-hover:animate-pulse">1000+</p>
                    <p className="text-xs uppercase tracking-widest text-white mt-2">Candidates</p>
                  </div>
                  <div className="bg-secondary-800 border border-primary-500/20 p-6 transition-all duration-300 hover:border-primary-500 hover:scale-105 group">
                    <p className="text-5xl font-bold text-primary-500 group-hover:animate-pulse">3</p>
                    <p className="text-xs uppercase tracking-widest text-white mt-2">Locations</p>
                  </div>
                </StaggerContainer>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

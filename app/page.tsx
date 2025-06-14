import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { HighlightsSection } from "@/components/highlights-section"
import { PartnershipsSection } from "@/components/partnerships-section"
import { BenefitsSection } from "@/components/benefits-section"
import { ProcessSection } from "@/components/process-section"
import { RecruitersSection } from "@/components/recruiters-section"
import { MagicalCursor } from "@/components/magical-cursor"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary-900">
      <MagicalCursor />
      <NavBar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <HighlightsSection />
        <PartnershipsSection />
        <BenefitsSection />
        <ProcessSection />
        <RecruitersSection />
      </main>
      <Footer />
    </div>
  )
}

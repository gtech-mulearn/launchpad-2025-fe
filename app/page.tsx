import { Schibsted_Grotesk } from "next/font/google";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Highlights } from "@/components/landing/highlights";
import { TalentFilter } from "@/components/landing/talent-filter";
import { Benefits } from "@/components/landing/benefits";
import { Partners } from "@/components/landing/partners";
import { Recruiters } from "@/components/landing/recruiters";
import { LandingFooter } from "@/components/landing/footer";
import { Film } from "@/components/landing/film";
import { News } from "@/components/landing/news";
import { MotionRoot } from "@/components/landing/motion";

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function HomePage() {
  return (
    <MotionRoot>
      <div
        className={`${grotesk.className} bg-paper text-ink antialiased selection:bg-primary-500 selection:text-ink`}
      >
        <Hero />
        <main>
          <About />
          <Film />
          <Highlights />
          <TalentFilter />
          <Benefits />
          <News />
          <Recruiters />
          <Partners />
        </main>
        <LandingFooter />
      </div>
    </MotionRoot>
  );
}

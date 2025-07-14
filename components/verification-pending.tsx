import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollReveal } from "./scroll-reveal";
import { Card, CardContent } from "./ui/card";

export function VerificationPending() {
  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ScrollReveal direction="scale" duration={800}>
          <Card className="bg-white border-primary-500/20">
            <CardContent className="p-8 text-center">
              <ScrollReveal direction="scale" delay={200}>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary-500" />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={400}>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4 uppercase tracking-tight">
                  Registration Successful!
                </h2>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={600}>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for registering with Launchpad Kerala 2025. Your
                  application has been received.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={800}>
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-6">
                  <p className="text-primary-600 font-medium text-sm uppercase tracking-widest">
                    Status: Verification Pending
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    We will contact you soon with further details about the
                    recruitment process. After verification, you can login to
                    dashboard using credentials.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={1000}>
                <Button
                  asChild
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white uppercase tracking-widest text-sm font-medium"
                >
                  <Link href="/">Return to Home</Link>
                </Button>
              </ScrollReveal>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}

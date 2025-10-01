import { Button } from "@/components/ui/button";
import { Shield, Map, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-blue-100 to-blue-200 pt-20 pb-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-white via-blue-100 to-blue-200 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <Shield className="w-4 h-4" />
              Next-Gen Safety Platform
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
                Smart Tourist Safety & Monitoring Portal
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                A unified AI-powered platform leveraging blockchain-simulated
                digital IDs to ensure comprehensive tourist safety, provide
                real-time monitoring, and enable rapid incident response across
                all destinations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                variant="hero"
                size="lg"
                className="text-lg px-8 py-6 bg-blue-500 hover:bg-gradient-to-r from-primary to-primary-glow"
              >
                <Link href="/dashboard">Access Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="heroOutline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link href="/register">Register Tourist →</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Tourists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">&lt;30s</div>
                <div className="text-sm text-muted-foreground">Response</div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative lg:ml-8">
            <div className="relative bg-white rounded-2xl p-4 shadow-elegant border border-border/50 backdrop-blur-sm">
              <img
                src="./assets/dashboard-screenshot.jpg"
                alt="Smart Tourist Safety Dashboard Interface"
                className="w-full rounded-2xl shadow-card"
              />

              {/* Floating elements */}
              <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium shadow-card animate-pulse">
                Live Monitoring
              </div>

              <div className="absolute -bottom-3 -left-3 bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-medium shadow-card flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />2 Active Alerts
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-hero opacity-20 rounded-3xl blur-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

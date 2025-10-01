import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, MapPin, AlertTriangle } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Tourist Registration",
    description: "Secure onboarding process creates blockchain-simulated digital identity with biometric verification and emergency contacts.",
    color: "text-primary",
  },
  {
    step: "02", 
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "GPS monitoring begins with geofencing setup, activity tracking, and continuous location updates for comprehensive coverage.",
    color: "text-accent",
  },
  {
    step: "03",
    icon: Shield,
    title: "AI Safety Analysis", 
    description: "Machine learning algorithms analyze patterns, predict risks, and monitor for anomalies using behavioral and environmental data.",
    color: "text-warning",
  },
  {
    step: "04",
    icon: AlertTriangle,
    title: "Emergency Response",
    description: "Instant alerts trigger coordinated response from local authorities, medical teams, and emergency services when incidents occur.",
    color: "text-destructive",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-secondary/20 via-background to-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How Our Platform Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A streamlined four-step process ensures comprehensive tourist safety from registration to emergency response, powered by cutting-edge technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-elegant transition-all duration-300 bg-gradient-card border border-border/50">
              <CardContent className="p-8 text-center">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-feature rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </CardContent>

              {/* Connection line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-card rounded-2xl p-8 border border-primary/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of destinations already using our platform to ensure tourist safety and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
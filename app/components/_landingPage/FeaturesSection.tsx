import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Map, 
  UserPlus, 
  AlertTriangle, 
  Smartphone, 
  Database,
  Users,
  Globe,
  Bell
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "AI-Powered Safety Monitoring",
    description: "Advanced machine learning algorithms continuously monitor tourist activities and detect potential safety risks in real-time.",
  },
  {
    icon: Map,
    title: "Real-Time Location Tracking",
    description: "GPS-enabled tracking with geofencing capabilities ensures tourists stay within safe zones and enables instant location updates.",
  },
  {
    icon: UserPlus,
    title: "Digital Identity Management",
    description: "Blockchain-simulated digital IDs provide secure, tamper-proof tourist identification and verification systems.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Response System",
    description: "Automated incident detection with instant alerts to local authorities and emergency services for rapid response coordination.",
  },
  {
    icon: Smartphone,
    title: "Mobile Integration",
    description: "Cross-platform mobile app integration ensures seamless communication between tourists and monitoring systems.",
  },
  {
    icon: Database,
    title: "Centralized Data Hub",
    description: "Comprehensive dashboard consolidating all tourist data, safety metrics, and incident reports in one secure location.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Comprehensive Safety Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with proven safety protocols to provide unmatched tourist protection and monitoring capabilities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border border-border/50 rounded-2xl">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-feature rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional stats */}
        <div className="mt-20 bg-gradient-feature rounded-2xl p-8 border border-primary/10">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">50,000+</div>
              <div className="text-muted-foreground">Active Tourist Profiles</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">150+</div>
              <div className="text-muted-foreground">Monitored Destinations</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">99.8%</div>
              <div className="text-muted-foreground">Alert Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
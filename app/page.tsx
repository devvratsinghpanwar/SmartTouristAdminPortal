import HowItWorksSection from "./components/_landingPage/HowItWorksSection";
import FeaturesSection from "./components/_landingPage/FeaturesSection";
import HeroSection from "./components/_landingPage/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </div>
  );
}

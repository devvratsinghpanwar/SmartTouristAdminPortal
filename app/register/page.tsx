import { Button } from '@/components/ui/button';
import RegistrationForm from '@/app/components/RegistrationForm';
import { UserPlus, ArrowLeft, Shield, Globe, Users } from 'lucide-react';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header Section */}
      <div className="relative">
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button variant="outline" size="sm" className="backdrop-blur-sm bg-background/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative pt-20 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon and Badge */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-hero shadow-elegant">
                  <UserPlus className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="p-1 rounded-full bg-accent">
                    <Shield className="h-3 w-3 text-accent-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Digital Tourist ID
              <span className="block text-primary mt-2">Generation Portal</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Issue a secure, blockchain-verified digital identity to tourists at entry points. 
              This comprehensive data forms the foundation for our advanced safety monitoring and 
              rapid emergency response system.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Shield className="h-4 w-4" />
                Blockchain Verified
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Globe className="h-4 w-4" />
                Real-time Monitoring
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning-foreground text-sm font-medium">
                <Users className="h-4 w-4" />
                Emergency Response
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <RegistrationForm />
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>Powered by advanced encryption and blockchain technology</span>
          </div>
        </div>
      </div>
    </div>
  );
}
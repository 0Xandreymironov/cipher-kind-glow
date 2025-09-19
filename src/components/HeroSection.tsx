import { Button } from "@/components/ui/button";
import { Shield, Eye, Heart } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Give with{" "}
            <span className="text-glow-primary animate-glow-pulse">Privacy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your donation amounts are encrypted using Fully Homomorphic Encryption, 
            protecting your privacy until charities choose to reveal totals.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <Shield className="w-5 h-5 text-glow-primary" />
            <span>FHE Encrypted</span>
          </div>
          <div className="flex items-center space-x-3 text-muted-foreground">
            <Eye className="w-5 h-5 text-glow-primary" />
            <span>Private by Default</span>
          </div>
          <div className="flex items-center space-x-3 text-muted-foreground">
            <Heart className="w-5 h-5 text-glow-primary" />
            <span>Maximum Impact</span>
          </div>
        </div>

        <div className="pt-8">
          <Button variant="glow" size="xl" className="shadow-glow">
            Start Giving Privately
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
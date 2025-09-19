import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Users, Globe, Zap, Star, TreePine, Droplets, BookOpen, Building2 } from "lucide-react";
import DonationDialog from "./DonationDialog";
import { useAccount } from 'wagmi';

interface EncryptedDonationBoxProps {
  title: string;
  description: string;
  encryptedAmount: string;
  donorCount: number;
  icon: "shield" | "heart" | "users" | "globe" | "zap" | "star" | "tree" | "droplets" | "book" | "building";
  progress: number;
  campaignId?: string;
}

const iconMap = {
  shield: Shield,
  heart: Heart,
  users: Users,
  globe: Globe,
  zap: Zap,
  star: Star,
  tree: TreePine,
  droplets: Droplets,
  book: BookOpen,
  building: Building2,
};

const EncryptedDonationBox = ({
  title,
  description,
  encryptedAmount,
  donorCount,
  icon,
  progress,
  campaignId,
}: EncryptedDonationBoxProps) => {
  const Icon = iconMap[icon];
  const { isConnected } = useAccount();

  return (
    <Card className="p-6 bg-card border-glow-primary/20 hover:border-glow-primary/40 transition-all duration-300 animate-glow-pulse hover:shadow-glow">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-glow-primary/10">
              <Icon className="w-6 h-6 text-glow-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-privacy-medium/30 border border-glow-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Encrypted Total</span>
              <Shield className="w-4 h-4 text-glow-primary" />
            </div>
            <div className="text-xl font-mono text-glow-primary bg-gradient-to-r from-transparent via-glow-primary/10 to-transparent bg-[length:200%_100%] animate-encrypted-shimmer p-2 rounded">
              {encryptedAmount}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{donorCount} private donors</span>
            <span className="text-glow-primary font-medium">{progress}% progress</span>
          </div>

          <div className="w-full bg-privacy-light rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-glow-primary to-glow-secondary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <DonationDialog 
          title={title} 
          campaignId={campaignId}
          trigger={
            <Button 
              variant="encrypted" 
              className="w-full"
              disabled={!isConnected}
            >
              {isConnected ? 'Donate Privately' : 'Connect Wallet to Donate'}
            </Button>
          } 
        />
      </div>
    </Card>
  );
};

export default EncryptedDonationBox;
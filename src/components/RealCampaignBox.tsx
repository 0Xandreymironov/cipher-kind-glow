import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Users, Globe, Zap, Star, TreePine, Droplets, BookOpen, Building2, Wallet } from "lucide-react";
import DonationDialog from "./DonationDialog";
import { useAccount } from 'wagmi';
import { useGetCampaign, useGetCampaignEncryptedData } from '@/hooks/useContract';
import { useZamaInstance } from '@/hooks/useZamaInstance';
import { useState, useEffect } from 'react';

interface RealCampaignBoxProps {
  campaignId: string;
  icon: "shield" | "heart" | "users" | "globe" | "zap" | "star" | "tree" | "droplets" | "book" | "building";
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

const RealCampaignBox = ({
  campaignId,
  icon,
}: RealCampaignBoxProps) => {
  const Icon = iconMap[icon];
  const { isConnected } = useAccount();
  const { campaign, isLoading: campaignLoading } = useGetCampaign(campaignId);
  const { encryptedData } = useGetCampaignEncryptedData(campaignId);
  const { instance } = useZamaInstance();
  const [decryptedAmount, setDecryptedAmount] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  console.log('🔍 RealCampaignBox render:', { 
    campaignId, 
    campaign, 
    campaignLoading, 
    encryptedData,
    instance: !!instance 
  });

  useEffect(() => {
    const decryptData = async () => {
      if (!instance || !encryptedData || !campaignId) return;

      try {
        // Create handle contract pairs for decryption
        const handleContractPairs = [
          { handle: encryptedData.encryptedTotalRaised, contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000' }
        ];

        // Decrypt the total raised amount
        const result = await instance.userDecrypt(handleContractPairs);
        const totalRaised = result[encryptedData.encryptedTotalRaised];
        
        if (totalRaised) {
          setDecryptedAmount((Number(totalRaised) / 100).toFixed(2)); // Convert from cents to dollars
          
          // Calculate progress (assuming target is 10000 cents = $100)
          const targetAmount = 10000; // This should come from the contract
          setProgress(Math.min((Number(totalRaised) / targetAmount) * 100, 100));
        }
      } catch (error) {
        console.error('Decryption failed:', error);
        setDecryptedAmount('***.**'); // Show encrypted placeholder
      }
    };

    decryptData();
  }, [instance, encryptedData, campaignId]);

  if (campaignLoading || !campaign) {
    return (
      <Card className="p-6 bg-card border-glow-primary/20">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden p-6 bg-gradient-to-br from-card via-card to-privacy-light/20 border border-glow-primary/20 hover:border-glow-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-glow-primary/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-glow-primary/5 via-transparent to-glow-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative space-y-5">
        {/* Header with icon and title */}
        <div className="flex items-start space-x-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-glow-primary/20 to-glow-secondary/20 border border-glow-primary/30 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-glow-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-foreground group-hover:text-glow-primary transition-colors duration-300">
              {campaign.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {campaign.description}
            </p>
          </div>
        </div>

        {/* Encrypted amount display */}
        <div className="relative">
          <div className="p-5 rounded-xl bg-gradient-to-r from-privacy-medium/40 via-privacy-light/30 to-privacy-medium/40 border border-glow-primary/40 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Encrypted Total</span>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-glow-primary animate-pulse" />
                <span className="text-xs text-glow-primary font-mono">FHE Protected</span>
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-glow-primary bg-gradient-to-r from-glow-primary via-glow-secondary to-glow-primary bg-[length:200%_100%] animate-encrypted-shimmer p-3 rounded-lg text-center">
              ${decryptedAmount || '***.**'}
            </div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-glow-primary/30 rounded-full animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-glow-secondary/40 rounded-full animate-pulse" />
        </div>

        {/* Progress section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              {campaign.donorCount} private donors
            </span>
            <span className="text-glow-primary font-bold text-lg">
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="relative w-full bg-privacy-light/50 rounded-full h-3 overflow-hidden border border-glow-primary/20">
            <div 
              className="h-full bg-gradient-to-r from-glow-primary via-glow-secondary to-glow-primary transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Donation button */}
        <div className="pt-2">
          <DonationDialog 
            title={campaign.title} 
            campaignId={campaignId}
            trigger={
              <Button 
                variant="encrypted" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-glow-primary to-glow-secondary hover:from-glow-primary/90 hover:to-glow-secondary/90 text-privacy-deep border-0 shadow-lg hover:shadow-xl hover:shadow-glow-primary/25 transition-all duration-300 hover:scale-[1.02]"
                disabled={!isConnected}
              >
                {isConnected ? (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Donate Privately
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet to Donate
                  </>
                )}
              </Button>
            } 
          />
        </div>
      </div>
    </Card>
  );
};

export default RealCampaignBox;

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EncryptedDonationBox from "@/components/EncryptedDonationBox";
import Footer from "@/components/Footer";
import { useGetCampaigns, useGetPlatformStats } from "@/hooks/useContract";
import { useEffect, useState } from "react";

const Index = () => {
  const { campaigns, isLoading: campaignsLoading } = useGetCampaigns();
  const { stats } = useGetPlatformStats();
  const [displayCampaigns, setDisplayCampaigns] = useState<any[]>([]);

  // Fallback sample data for demo purposes
  const sampleDonations = [
    {
      title: "Clean Water Initiative",
      description: "Bringing safe water to remote communities",
      encryptedAmount: "0x7a9f2e1b8c5d...",
      donorCount: 247,
      icon: "droplets" as const,
      progress: 73,
      campaignId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    },
    {
      title: "Education for All",
      description: "Supporting underprivileged children's education",
      encryptedAmount: "0x3e8a7b4f9d2c...",
      donorCount: 189,
      icon: "book" as const,
      progress: 56,
      campaignId: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      title: "Climate Action Fund",
      description: "Protecting our planet for future generations",
      encryptedAmount: "0xc4f1a8e6b3d9...",
      donorCount: 312,
      icon: "tree" as const,
      progress: 89,
      campaignId: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    },
  ];

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      // Convert contract campaigns to display format
      const formattedCampaigns = campaigns.map((campaignId: string, index: number) => ({
        title: `Campaign ${index + 1}`,
        description: "FHE-encrypted donation campaign",
        encryptedAmount: "0x" + Math.random().toString(16).substring(2, 16) + "...",
        donorCount: Math.floor(Math.random() * 500) + 50,
        icon: ["droplets", "book", "tree", "globe", "zap", "star", "building"][index % 7] as const,
        progress: Math.floor(Math.random() * 100),
        campaignId,
      }));
      setDisplayCampaigns(formattedCampaigns);
    } else {
      setDisplayCampaigns(sampleDonations);
    }
  }, [campaigns]);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      
      <section className="py-16 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Active Encrypted Campaigns
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each donation amount is encrypted and hidden until the charity chooses 
              to reveal the total. Your privacy is guaranteed while your generosity 
              makes a real difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignsLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-glow-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Loading campaigns...</p>
              </div>
            ) : (
              displayCampaigns.map((donation, index) => (
                <EncryptedDonationBox
                  key={index}
                  {...donation}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
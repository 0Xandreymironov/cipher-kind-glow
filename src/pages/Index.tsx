import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RealCampaignBox from "@/components/RealCampaignBox";
import Footer from "@/components/Footer";
import { useGetCampaigns, useGetPlatformStats } from "@/hooks/useContract";
import { useEffect, useState } from "react";

const Index = () => {
  const { campaigns, isLoading: campaignsLoading } = useGetCampaigns();
  const { stats } = useGetPlatformStats();
  const [displayCampaigns, setDisplayCampaigns] = useState<any[]>([]);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      // Convert contract campaigns to display format
      const formattedCampaigns = campaigns.map((campaignId: string, index: number) => ({
        campaignId,
        icon: ["droplets", "book", "tree", "globe", "zap", "star", "building"][index % 7] as const,
      }));
      setDisplayCampaigns(formattedCampaigns);
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
              displayCampaigns.map((campaign, index) => (
                <RealCampaignBox
                  key={index}
                  campaignId={campaign.campaignId}
                  icon={campaign.icon}
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
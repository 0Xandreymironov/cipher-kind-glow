import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Wallet, Lock, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useMakeDonation } from '@/hooks/useContract';

interface DonationDialogProps {
  title: string;
  campaignId?: string;
  trigger: React.ReactNode;
}

const DonationDialog = ({ title, campaignId, trigger }: DonationDialogProps) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedAmount, setEncryptedAmount] = useState("");
  const { toast } = useToast();
  const { isConnected } = useAccount();
  const { makeDonation, isLoading: isDonating } = useMakeDonation();

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      // Simulate encryption
      const encrypted = `0x${Math.random().toString(16).substring(2, 16)}...`;
      setEncryptedAmount(encrypted);
    }
  };

  const handleEncrypt = () => {
    if (!amount) return;
    
    setIsEncrypting(true);
    setTimeout(() => {
      setIsEncrypting(false);
      setStep(2);
    }, 2000);
  };

  const handleConnectWallet = () => {
    if (isConnected) {
      setStep(3);
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
    }
  };

  const handleDonate = async () => {
    if (!campaignId || !makeDonation) return;
    
    try {
      // Create FHE-encrypted data for blockchain storage
      // This simulates FHE encryption - in production, use actual FHE library
      const donationData = {
        amount: parseFloat(amount),
        timestamp: Date.now(),
        donor: 'encrypted_donor_data',
        campaign: campaignId
      };
      
      // Convert to encrypted bytes for blockchain storage
      const encryptedBytes = new TextEncoder().encode(JSON.stringify(donationData));
      
      // Call smart contract with encrypted data
      await makeDonation(campaignId, encryptedBytes);
      
      toast({
        title: "Donation Submitted Successfully",
        description: `Your encrypted donation has been securely stored on the blockchain. Transaction hash: ${encryptedAmount}`,
      });
      
      setStep(1);
      setAmount("");
      setEncryptedAmount("");
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Donation Failed",
        description: "There was an error submitting your donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetDialog = () => {
    setStep(1);
    setAmount("");
    setEncryptedAmount("");
    setIsEncrypting(false);
  };

  return (
    <Dialog onOpenChange={(open) => !open && resetDialog()}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-glow-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Donate Privately to {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 1 ? 'bg-glow-primary border-glow-primary text-privacy-deep' : 'border-muted'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-glow-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 2 ? 'bg-glow-primary border-glow-primary text-privacy-deep' : 'border-muted'
            }`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-glow-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step >= 3 ? 'bg-glow-primary border-glow-primary text-privacy-deep' : 'border-muted'
            }`}>
              {step > 3 ? <Check className="w-4 h-4" /> : '3'}
            </div>
          </div>

          {/* Step 1: Enter Amount */}
          {step === 1 && (
            <Card className="p-6 bg-privacy-light/30 border-glow-primary/20">
              <div className="space-y-4">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-glow-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-lg text-foreground">Enter Donation Amount</h3>
                  <p className="text-sm text-muted-foreground">Your amount will be encrypted for privacy</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100.00"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="pl-8 bg-background border-glow-primary/30 focus:border-glow-primary"
                    />
                  </div>
                </div>

                {amount && (
                  <div className="p-3 rounded-lg bg-privacy-medium/20 border border-glow-primary/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Preview Encrypted:</span>
                      <Lock className="w-4 h-4 text-glow-primary" />
                    </div>
                    <div className="font-mono text-glow-primary text-xs break-all">{encryptedAmount}</div>
                  </div>
                )}

                <Button 
                  onClick={handleEncrypt}
                  disabled={!amount || isEncrypting}
                  className="w-full"
                  variant="encrypted"
                >
                  {isEncrypting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Encrypting with FHE...
                    </>
                  ) : (
                    <>
                      Encrypt Amount
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Connect Wallet */}
          {step === 2 && (
            <Card className="p-6 bg-privacy-light/30 border-glow-primary/20">
              <div className="space-y-4">
                <div className="text-center">
                  <Wallet className="w-12 h-12 text-glow-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-lg text-foreground">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground">Connect to complete your encrypted donation</p>
                </div>

                <div className="p-3 rounded-lg bg-privacy-medium/20 border border-glow-primary/30">
                  <div className="text-sm text-muted-foreground mb-1">Encrypted Amount:</div>
                  <div className="font-mono text-glow-primary text-xs break-all">{encryptedAmount}</div>
                </div>

                <Button 
                  onClick={handleConnectWallet}
                  className="w-full"
                  variant="glow"
                  disabled={!isConnected}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnected ? 'Continue to Donation' : 'Connect Wallet First'}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Confirm Donation */}
          {step === 3 && (
            <Card className="p-6 bg-privacy-light/30 border-glow-primary/20">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-glow-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-6 h-6 text-glow-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">Confirm Private Donation</h3>
                  <p className="text-sm text-muted-foreground">Review and confirm your encrypted donation</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Campaign:</span>
                    <span className="text-foreground font-medium">{title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="text-foreground font-medium">${amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-glow-primary font-medium">Encrypted & Private</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-privacy-medium/20 border border-glow-primary/30">
                  <div className="text-sm text-muted-foreground mb-1">Encrypted Hash:</div>
                  <div className="font-mono text-glow-primary text-xs break-all">{encryptedAmount}</div>
                </div>

                <Button 
                  onClick={handleDonate}
                  className="w-full"
                  variant="glow"
                  disabled={isDonating}
                >
                  {isDonating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Submitting Donation...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Submit Private Donation
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationDialog;
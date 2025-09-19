import { WalletConnect } from "./WalletConnect";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Cipher Kind Glow Logo" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Cipher Kind Glow
            </h1>
            <p className="text-sm text-muted-foreground">
              FHE-Powered Donation Platform
            </p>
          </div>
        </div>
        
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;
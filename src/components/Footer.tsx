import { useState, useEffect } from "react";

const DigitalCandle = ({ delay = 0 }: { delay?: number }) => {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(Math.random() > 0.7);
    }, 1500 + delay);

    return () => clearInterval(interval);
  }, [delay]);

  return (
    <div className="relative">
      <div className="w-6 h-8 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-full animate-candle-flicker shadow-candle" />
      <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-300 rounded-full ${flicker ? 'animate-candle-flicker' : ''} shadow-candle`} />
      <div className="w-8 h-2 bg-privacy-medium rounded-full mt-1" />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full py-12 px-4 lg:px-8 bg-gradient-to-t from-privacy-deep/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-8 mb-8">
          <DigitalCandle delay={0} />
          <DigitalCandle delay={300} />
          <DigitalCandle delay={600} />
          <DigitalCandle delay={900} />
          <DigitalCandle delay={1200} />
        </div>
        
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Illuminating Generosity Through Privacy
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Using Fully Homomorphic Encryption, your donation amounts remain completely private 
            until the charity chooses to reveal the total. Give with confidence, knowing your 
            privacy is protected while your generosity makes a difference.
          </p>
          
          <div className="flex items-center justify-center space-x-6 pt-6 text-sm text-muted-foreground">
            <span>© 2024 Private Giving</span>
            <span>•</span>  
            <span>Powered by FHE</span>
            <span>•</span>
            <span>Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
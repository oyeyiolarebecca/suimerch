import { Wallet, ShoppingBag, Receipt, Database } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Connect your Sui wallet to browse and purchase merch.",
  },
  {
    icon: ShoppingBag,
    title: "Choose Your Merch",
    description: "Browse products with images stored on Walrus decentralized storage.",
  },
  {
    icon: Database,
    title: "Pay with SUI",
    description: "Complete your purchase using SUI tokens. Smart contract handles everything.",
  },
  {
    icon: Receipt,
    title: "Get NFT Receipt",
    description: "Receive an on-chain Receipt NFT as proof of purchase.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-secondary/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 border-2 border-border bg-background font-mono text-sm mb-4">
            DECENTRALIZED
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Onchain Sui merch store
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-6 border-2 border-border bg-background shadow-sm hover:shadow-md transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold border-2 border-border">
                {index + 1}
              </div>
              
              <step.icon className="h-10 w-10 mb-4 text-primary" />
              
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

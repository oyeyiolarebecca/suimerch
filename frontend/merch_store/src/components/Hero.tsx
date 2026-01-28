import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-yeti.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-block mb-6 px-4 py-2 border-2 border-border bg-background font-mono text-sm">
          SUI MERCH STORE
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <br />
          <span className="text-primary"></span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
          
        </p>
        
        <Button
          size="lg"
          className="text-lg px-8 py-6 shadow-md hover:shadow-lg hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
        >
          View Catalog
          <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;

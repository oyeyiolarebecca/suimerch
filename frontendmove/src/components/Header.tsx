import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import WalletButton from "./WalletButton";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-fun flex items-center justify-center shadow-fun animate-bounce-slow">
            <span className="text-xl">🦭</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SUI MERCH
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground font-medium hover:text-primary transition-colors">
            Shop All
          </a>
          <a href="#" className="text-muted-foreground font-medium hover:text-primary transition-colors">
            New Arrivals
          </a>
          <a href="#" className="text-muted-foreground font-medium hover:text-primary transition-colors">
            Collections
          </a>
          <a href="#" className="text-muted-foreground font-medium hover:text-primary transition-colors">
            About
          </a>
        </nav>

        {/* Wallet & Cart & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Wallet Connect Button */}
          <div className="hidden sm:block">
            <WalletButton />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
              0
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-card border-t border-border p-4 space-y-4">
          <div className="pb-4 border-b border-border">
            <WalletButton />
          </div>
          <a href="#" className="block text-foreground font-medium py-2">Shop All</a>
          <a href="#" className="block text-muted-foreground font-medium py-2">New Arrivals</a>
          <a href="#" className="block text-muted-foreground font-medium py-2">Collections</a>
          <a href="#" className="block text-muted-foreground font-medium py-2">About</a>
        </nav>
      )}
    </header>
  );
};

export default Header;

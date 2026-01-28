import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletButton from "./WalletButton";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight">SuiMerch</span>
          <span className="text-xs font-mono bg-primary text-primary-foreground px-2 py-0.5 border border-border">
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#catalog" className="text-sm font-medium hover:underline underline-offset-4">
            Catalog
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
            How It Works
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold border border-border">
                {cartCount}
              </span>
            )}
          </Button>
          
          <WalletButton />
        </div>
      </div>
    </header>
  );
};

export default Header;

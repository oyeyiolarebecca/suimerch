import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Sparkles, Loader2 } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { usePurchase } from "@/hooks/usePurchase";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSoldOut?: boolean;
  productId?: number;
}


const suiToMist = (suiPrice: number): bigint => {
  return BigInt(Math.floor(suiPrice * 1_000_000_000));
};

const ProductCard = ({ name, price, image, category, isNew, isSoldOut, productId = 1 }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { purchase } = usePurchase();

  const handlePurchase = async () => {
    if (!account) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your Sui wallet to make a purchase.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Select size first",
      description: "Please click on the product to select your size before purchasing.",
    });
    navigate(`/product/${productId}`);
  };

  return (
    <div 
      className="group relative rounded-2xl bg-card p-4 shadow-card transition-all duration-500 hover:shadow-hover hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {isNew && (
          <Badge className="bg-primary text-primary-foreground animate-pulse-glow">
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        )}
        {isSoldOut && (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            SOLD OUT
          </Badge>
        )}
      </div>

      {/* Like Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm transition-all duration-300 hover:scale-110"
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-300 ${
            isLiked 
              ? "fill-accent text-accent scale-110" 
              : "text-muted-foreground hover:text-accent"
          }`} 
        />
      </button>

     
      <div 
        className="relative overflow-hidden rounded-xl bg-muted mb-4 aspect-square cursor-pointer"
        onClick={() => navigate(`/product/${productId}`)}
      >
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-contain transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        
        {/* Quick Add Overlay */}
        <div className={`absolute inset-0 flex items-end justify-center pb-4 transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <Button 
            className={`${
              isSuccess ? "bg-green-500 hover:bg-green-600" : "gradient-fun"
            } text-primary-foreground border-0 shadow-fun transform translate-y-4 group-hover:translate-y-0 transition-all duration-300`}
            disabled={isSoldOut || isPurchasing || isSuccess}
            onClick={handlePurchase}
          >
            {isPurchasing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : isSuccess ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Success! ✅
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isSoldOut ? "Notify Me" : account ? "Buy with SUI" : "Connect Wallet"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
          {category}
        </p>
        <h3 className="text-lg font-bold text-foreground leading-tight">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            {price} SUI
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

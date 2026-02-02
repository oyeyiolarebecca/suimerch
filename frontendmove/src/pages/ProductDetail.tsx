import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { usePurchase } from "@/hooks/usePurchase";
import { toast } from "@/hooks/use-toast";

import walrusHoodie from "@/assets/walrus-hoodie.jpg";
import walrusTracksuit from "@/assets/walrus-tracksuit.jpg";
import suiStakeJersey from "@/assets/sui-stake-jersey.jpg";
import suiPolo from "@/assets/sui-polo.jpg";
import suiBasketball from "@/assets/sui-basketball.jpg";
import lofiJersey from "@/assets/lofi-jersey.jpg";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  nftImage?: string; // Image URL to use for NFT minting
  category: string;
  isNew?: boolean;
  isSoldOut?: boolean;
  sizes: string[];
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Walrus Pattern Puffer Hoodie",
    price: 0.3,
    image: walrusHoodie,
    nftImage: "https://i.postimg.cc/P53XHXS6/walrusone.jpg",
    category: "Hoodies",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "Premium puffer hoodie featuring the iconic Walrus pattern. Perfect for staying warm while showing your SUI community spirit.",
  },
  {
    id: 2,
    name: "Walrus Logo Tracksuit",
    price: 0.3,
    image: walrusTracksuit,
    nftImage: "https://postimg.cc/HrMD4gDB",
    category: "Sets",
    isNew: true,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    description: "Complete tracksuit set with Walrus branding. Comfort meets style with premium fabric and attention to detail.",
  },
  {
    id: 3,
    name: "SUI Stake Jersey",
    price: 0.2,
    image: suiStakeJersey,
    nftImage: "https://postimg.cc/VJtQB8QZ",
    category: "Jerseys",
    isNew: false,
    sizes: ["S", "M", "L", "XL", "2XL"],
    description: "Official SUI Stake Jersey - perfect for sports enthusiasts and blockchain believers alike.",
  },
  {
    id: 4,
    name: "SUI Droplet Polo Shirt",
    price: 0.3,
    image: suiPolo,
    category: "Shirts",
    isNew: false,
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    description: "Elegant polo shirt featuring the SUI droplet design. Great for casual wear or special occasions.",
  },
  {
    id: 5,
    name: "SUI Basketball Jersey #7",
    price: 0.3,
    image: suiBasketball,
    category: "Jerseys",
    isNew: true,
    sizes: ["S", "M", "L", "XL", "2XL"],
    description: "Limited edition basketball jersey with SUI branding. Show your support for the ecosystem in style.",
  },
  {
    id: 6,
    name: "LOFI Yeti Jersey",
    price: 0.2,
    image: lofiJersey,
    nftImage: "https://postimg.cc/QBrLfyhz",
    category: "Jerseys",
    isNew: false,
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Chill vibes with the LOFI Yeti Jersey. Perfect for layering or wearing on its own.",
  },
];

const suiToMist = (suiPrice: number): bigint => {
  return BigInt(Math.floor(suiPrice * 1_000_000_000));
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isLiked, setIsLiked] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const account = useCurrentAccount();
  const { purchase } = usePurchase();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/")} className="gradient-fun text-primary-foreground">
            Back to Store
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!selectedSize) {
      toast({
        title: "Select a size",
        description: "Please choose a size before purchasing.",
        variant: "destructive",
      });
      return;
    }

    if (!account) {
      toast({
        title: "Connect your wallet",
        description: "Please connect your Sui wallet to make a purchase.",
        variant: "destructive",
      });
      return;
    }

    setIsPurchasing(true);
    try {
      const priceInMist = suiToMist(product.price);
      await purchase({
        productId: product.id,
        productName: product.name,
        price: product.price,
        size: selectedSize,
        productImage: product.nftImage || product.image,
        priceInMist,
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Content */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Back to Store</span>
          </button>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Image Section */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="relative rounded-xl sm:rounded-2xl bg-muted overflow-hidden aspect-square w-full max-h-96 sm:max-h-none">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 sm:p-4"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col justify-start space-y-4 sm:space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                {product.isNew && (
                  <Badge className="bg-primary text-primary-foreground animate-pulse-glow text-xs sm:text-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    NEW
                  </Badge>
                )}
                {product.isSoldOut && (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs sm:text-sm">
                    SOLD OUT
                  </Badge>
                )}
              </div>

              {/* Category */}
              <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {product.category}
              </p>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="text-3xl sm:text-4xl font-bold text-primary">
                {product.price} SUI
              </div>

              {/* Size Selection */}
              <div className="space-y-3 sm:space-y-4">
                <label className="text-base sm:text-lg font-semibold text-foreground">
                  Select Size
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 sm:py-3 px-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 border-2 ${
                        selectedSize === size
                          ? "gradient-fun text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-transparent hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6">
                <Button
                  className="flex-1 gradient-fun text-primary-foreground border-0 shadow-fun h-12 sm:h-14 text-sm sm:text-lg"
                  disabled={product.isSoldOut || isPurchasing}
                  onClick={handlePurchase}
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2 animate-spin" />
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">
                        {product.isSoldOut ? "Notify Me" : account ? "Buy with SUI" : "Connect Wallet"}
                      </span>
                      <span className="sm:hidden">
                        {product.isSoldOut ? "Notify" : account ? "Buy" : "Connect"}
                      </span>
                    </>
                  )}
                </Button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-3 sm:p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Heart
                    className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-300 ${
                      isLiked
                        ? "fill-accent text-accent"
                        : "text-muted-foreground hover:text-accent"
                    }`}
                  />
                </button>
              </div>

              {/* Product Features */}
              <div className="pt-4 sm:pt-6 border-t border-muted space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Why Choose This?</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="text-xl sm:text-2xl flex-shrink-0">🚀</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Fast Shipping</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Worldwide delivery in 5-7 days</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="text-xl sm:text-2xl flex-shrink-0">💎</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Premium Quality</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">High-end materials, lasting comfort</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="text-xl sm:text-2xl flex-shrink-0">🦭</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Exclusive Design</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Limited edition SUI ecosystem art</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;

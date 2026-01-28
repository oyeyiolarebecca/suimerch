import { useState } from "react";
import { toast } from "sonner";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import HowItWorks from "@/components/HowItWorks";
import ContractPreview from "@/components/ContractPreview";
import CartSheet from "@/components/CartSheet";
import Footer from "@/components/Footer";
import { Product } from "@/components/ProductCard";

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      return;
    }

    // In a real implementation, you would build and execute the transaction here
    // For demo purposes, we show what would happen
    toast.success("Demo: Transaction would be submitted to Sui testnet!", {
      description: `Connected wallet: ${currentAccount.address.slice(0, 8)}...`,
    });
    
    // Show transaction details that would be sent
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    toast.info(`Would transfer ${total.toFixed(2)} SUI and mint ${cartItems.length} Receipt NFTs`);
    
    setCartItems([]);
    setCartOpen(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />
      
      <main>
        <Hero />
        <ProductGrid onAddToCart={handleAddToCart} />
        <HowItWorks />
        <ContractPreview />
      </main>
      
      <Footer />
      
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default Index;

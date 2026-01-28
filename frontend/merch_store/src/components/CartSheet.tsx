import { Trash2, ExternalLink } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Product } from "./ProductCard";

interface CartItem extends Product {
  quantity: number;
}

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const CartSheet = ({ 
  open, 
  onOpenChange, 
  items, 
  onRemoveItem, 
  onCheckout,
}: CartSheetProps) => {
  const currentAccount = useCurrentAccount();
  const walletConnected = !!currentAccount;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l-2 border-border">
        <SheetHeader>
          <SheetTitle className="text-left font-bold text-xl">Your Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Shopping cart with your selected items
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground font-mono text-sm">Cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-4 border-2 border-border bg-card"
                  >
                    <div className="w-20 h-20 border border-border overflow-hidden shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {item.price} SUI × {item.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                        blob: {item.walrusBlobId}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="border-t-2 border-border pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="font-mono text-lg">{total.toFixed(2)} SUI</span>
                </div>
                
                {walletConnected && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Connected: {currentAccount.address.slice(0, 8)}...
                  </p>
                )}
                
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!walletConnected}
                  onClick={onCheckout}
                >
                  {walletConnected ? (
                    <>
                      Purchase & Mint Receipt
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Connect Wallet to Checkout"
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground font-mono">
                  Each item mints a separate Receipt NFT
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;

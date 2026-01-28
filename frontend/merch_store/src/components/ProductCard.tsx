import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  walrusBlobId: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} SUI`;
  };

  return (
    <Card className="group overflow-hidden border-2 border-border bg-card shadow-sm hover:shadow-md transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden border-b-2 border-border">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
            <span className="font-mono text-sm bg-secondary px-2 py-1 border border-border shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className={`px-2 py-0.5 border ${product.stock > 0 ? 'border-primary bg-primary/10' : 'border-destructive bg-destructive/10'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'SOLD OUT'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={product.stock === 0}
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

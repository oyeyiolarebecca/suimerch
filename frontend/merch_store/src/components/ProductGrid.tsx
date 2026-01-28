import ProductCard, { Product } from "./ProductCard";
import hoodieImg from "@/assets/product-hoodie.jpg";
import mugImg from "@/assets/product-mug.jpg";
import beanieImg from "@/assets/product-beanie.jpg";
import pinsImg from "@/assets/product-pins.jpg";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Yeti Mode Hoodie",
    description: "Cozy navy hoodie with embroidered yeti logo. Perfect for chill vibes and late night coding sessions.",
    price: 2.5,
    stock: 15,
    image: hoodieImg,
    walrusBlobId: "blobid_hoodie_abc123",
  },
  {
    id: "2",
    name: "Lofi Yeti Mug",
    description: "Ceramic mug featuring our iconic yeti. Holds your coffee while you hold the line.",
    price: 0.8,
    stock: 42,
    image: mugImg,
    walrusBlobId: "blobid_mug_def456",
  },
  {
    id: "3",
    name: "Chill Beanie",
    description: "Warm beanie with a subtle yeti patch. Stay warm, stay chill.",
    price: 1.2,
    stock: 8,
    image: beanieImg,
    walrusBlobId: "blobid_beanie_ghi789",
  },
  {
    id: "4",
    name: "Yeti Pin Set",
    description: "Collectible enamel pins featuring different yeti expressions. Set of 4.",
    price: 0.5,
    stock: 0,
    image: pinsImg,
    walrusBlobId: "blobid_pins_jkl012",
  },
];

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
  return (
    <section id="catalog" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 border-2 border-border bg-secondary font-mono text-sm mb-4">
            WINTER DROP
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop the Collection</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Each item is stored on Walrus and verified on Sui. Your purchase = your NFT receipt.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;

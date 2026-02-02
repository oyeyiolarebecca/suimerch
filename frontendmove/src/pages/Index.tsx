import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

import walrusHoodie from "@/assets/walrus-hoodie.jpg";
import walrusTracksuit from "@/assets/walrus-tracksuit.jpg";
import suiStakeJersey from "@/assets/sui-stake-jersey.jpg";
import suiPolo from "@/assets/sui-polo.jpg";
import suiBasketball from "@/assets/sui-basketball.jpg";
import lofiJersey from "@/assets/lofi-jersey.jpg";

const products = [
  {
    name: "Walrus Pattern Puffer Hoodie",
    price: 0.3,
    image: walrusHoodie,
    category: "Hoodies",
    isNew: true,
    productId: 1,
  },
  {
    name: "Walrus Logo Tracksuit",
    price: 0.3,
    image: walrusTracksuit,
    category: "Sets",
    isNew: true,
    productId: 2,
  },
  {
    name: "SUI Stake Jersey",
    price: 0.2,
    image: suiStakeJersey,
    category: "Jerseys",
    isNew: false,
    productId: 3,
  },
  {
    name: "SUI Droplet Polo Shirt",
    price: 0.3,
    image: suiPolo,
    category: "Shirts",
    isNew: false,
    productId: 4,
  },
  {
    name: "SUI Basketball Jersey #7",
    price: 0.3,
    image: suiBasketball,
    category: "Jerseys",
    isNew: true,
    productId: 5,
  },
  {
    name: "LOFI Yeti Jersey",
    price: 0.2,
    image: lofiJersey,
    category: "Jerseys",
    isNew: false,
    productId: 6,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Latest Drops 🔥
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fresh merch for the SUI community. Limited editions, unlimited vibes.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["All", "Hoodies", "Jerseys", "Shirts", "Sets"].map((category, index) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  index === 0
                    ? "gradient-fun text-primary-foreground shadow-fun"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={index}
                className="animate-float"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-16 gradient-fun">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-primary-foreground">
            <div className="space-y-2">
              <div className="text-4xl mb-2">🚀</div>
              <h3 className="text-xl font-bold">Fast Shipping</h3>
              <p className="text-primary-foreground/80">Worldwide delivery in 5-7 days</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl mb-2">🦭</div>
              <h3 className="text-xl font-bold">Exclusive Designs</h3>
              <p className="text-primary-foreground/80">Limited edition SUI ecosystem art</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl mb-2">💎</div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-primary-foreground/80">High-end materials, lasting comfort</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

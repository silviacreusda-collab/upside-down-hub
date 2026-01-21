import { ShoppingBag, Star, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const products = [
  {
    id: 1,
    name: "Camiseta Hawkins High",
    price: "24,99€",
    rating: 4.8,
    category: "Ropa",
    affiliateUrl: "https://www.amazon.es/s?k=camiseta+hawkins+high+stranger+things",
    image: "👕",
  },
  {
    id: 2,
    name: "Figura coleccionable Eleven",
    price: "14,99€",
    rating: 4.9,
    category: "Colección",
    affiliateUrl: "https://www.amazon.es/s?k=figura+eleven+stranger+things",
    image: "🎭",
  },
  {
    id: 3,
    name: "Póster estilo Upside Down",
    price: "12,99€",
    rating: 4.7,
    category: "Decoración",
    affiliateUrl: "https://www.amazon.es/s?k=poster+stranger+things+upside+down",
    image: "🖼️",
  },
  {
    id: 4,
    name: "Taza Eggo Waffles",
    price: "9,99€",
    rating: 4.6,
    category: "Hogar",
    affiliateUrl: "https://www.amazon.es/s?k=taza+eggo+waffles+stranger+things",
    image: "☕",
  },
];

export const MerchSection = () => {
  const { toast } = useToast();

  const handleProductClick = (product: typeof products[0]) => {
    toast({
      title: "Redirigiendo a Amazon...",
      description: `Buscando "${product.name}" en Amazon España.`,
    });
    window.open(product.affiliateUrl, "_blank");
  };

  return (
    <section id="merch" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-neon-yellow" />
              <span className="font-display text-neon-yellow tracking-[0.3em] text-sm">
                MERCHANDISING
              </span>
            </div>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground">
              TIENDA <span className="text-neon-cyan">OFICIAL</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Enlaces de afiliado a productos oficiales. Cada compra apoya la comunidad.
            </p>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <a href="https://www.amazon.es/s?k=stranger+things" target="_blank" rel="noopener noreferrer">
              Ver todo en Amazon <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group relative bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 card-neon-hover cursor-pointer"
            >
              {/* Product image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-neon-cyan/20 via-neon-magenta/10 to-neon-yellow/20 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition-transform">{product.image}</span>
              </div>
              
              <div className="p-4">
                <span className="text-xs font-display text-neon-magenta tracking-wider">
                  {product.category}
                </span>
                <h3 className="font-title text-lg text-foreground mt-1 group-hover:text-neon-cyan transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-display text-neon-yellow text-lg">
                    {product.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-neon-yellow fill-neon-yellow" />
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                  </div>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              {/* External link indicator */}
              <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Affiliate disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          * Enlaces de afiliado a Amazon. Podemos recibir una comisión por las compras realizadas.
        </p>
      </div>
    </section>
  );
};

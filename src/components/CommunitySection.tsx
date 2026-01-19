import { Button } from "@/components/ui/button";
import { Users, MessageSquare, MapPin, ShoppingBag, ArrowRight } from "lucide-react";

const communityFeatures = [
  {
    icon: MessageSquare,
    title: "Foros de Discusión",
    description: "Debate teorías, comparte opiniones y conecta con fans de toda España.",
    color: "neon-red",
    stats: "2.5K+ posts",
  },
  {
    icon: MapPin,
    title: "Comunidad Local",
    description: "Encuentra fans en tu ciudad y organiza quedadas temáticas.",
    color: "neon-cyan",
    stats: "50+ ciudades",
  },
  {
    icon: ShoppingBag,
    title: "Compra/Venta/Intercambio",
    description: "Mercado de coleccionables entre fans. Primer mes gratis.",
    color: "neon-magenta",
    stats: "300+ anuncios",
  },
];

export const CommunitySection = () => {
  return (
    <section id="comunidad" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-upside-down opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-red/5 rounded-full blur-[100px]" />
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-neon-cyan" />
            <span className="font-display text-neon-cyan tracking-[0.3em] text-sm">
              COMUNIDAD
            </span>
          </div>
          <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            ÚNETE A LA <span className="text-neon-magenta">COMUNIDAD</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conecta con miles de fans de Stranger Things en toda España. 
            Comparte, debate, intercambia y haz nuevos amigos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {communityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 card-neon-hover"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="font-title text-xl md:text-2xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>
                
                {/* Stats */}
                <div className={`inline-flex items-center gap-2 text-sm font-display tracking-wider text-${feature.color}`}>
                  {feature.stats}
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t from-${feature.color}/5 to-transparent`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="neon-magenta" size="lg">
            Explorar Comunidad <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

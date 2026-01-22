import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, MapPin, ShoppingBag, ArrowRight, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const communityFeatures = [
  {
    icon: MessageSquare,
    title: "Foros de Discusión",
    description: "Debate teorías, comparte opiniones y conecta con fans de toda España.",
    stats: "2.5K+ posts",
    iconColor: "text-neon-red",
    bgColor: "bg-neon-red/10",
    action: "foros",
  },
  {
    icon: MapPin,
    title: "Comunidad Local",
    description: "Encuentra fans en tu ciudad y organiza quedadas temáticas.",
    stats: "50+ ciudades",
    iconColor: "text-neon-cyan",
    bgColor: "bg-neon-cyan/10",
    action: "local",
  },
  {
    icon: ShoppingBag,
    title: "Compra/Venta/Intercambio",
    description: "Mercado de coleccionables entre fans. Primer mes gratis.",
    stats: "300+ anuncios",
    iconColor: "text-neon-magenta",
    bgColor: "bg-neon-magenta/10",
    action: "mercado",
  },
];

export const CommunitySection = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<typeof communityFeatures[0] | null>(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const { toast } = useToast();

  const handleFeatureClick = (feature: typeof communityFeatures[0]) => {
    setSelectedFeature(feature);
    setShowModal(true);
  };

  const handleJoin = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      });
      return;
    }

    setJoined(true);
    toast({
      title: "¡Bienvenido a la comunidad!",
      description: "Te hemos enviado un email de confirmación.",
    });
    setShowModal(false);
    setEmail("");
  };

  const handleExploreClick = () => {
    setSelectedFeature(null);
    setShowModal(true);
  };

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
                onClick={() => handleFeatureClick(feature)}
                className="group relative bg-card/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 card-neon-hover cursor-pointer"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                
                {/* Content */}
                <h3 className="font-title text-xl md:text-2xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {feature.description}
                </p>
                
                {/* Stats */}
                <div className={`inline-flex items-center gap-2 text-sm font-display tracking-wider ${feature.iconColor}`}>
                  {feature.stats}
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-magenta/5 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="neon-magenta" size="lg" onClick={handleExploreClick}>
            {joined ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Ya eres miembro
              </>
            ) : (
              <>
                Explorar Comunidad <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Join Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-2xl border border-border/50 max-w-md w-full p-6 shadow-[0_0_60px_hsl(var(--neon-magenta)/0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-magenta" />
                <span className="font-display text-neon-magenta text-sm">COMUNIDAD</span>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-title text-2xl text-foreground mb-2">
              {selectedFeature ? selectedFeature.title : "Únete a la Comunidad"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedFeature 
                ? selectedFeature.description 
                : "Regístrate para acceder a todos los beneficios de nuestra comunidad de fans."}
            </p>
            
            {joined ? (
              <div className="text-center py-4">
                <CheckCircle className="w-16 h-16 text-neon-cyan mx-auto mb-4" />
                <p className="text-foreground font-medium">¡Ya eres miembro!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Gracias por unirte a nuestra comunidad.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/50 transition-colors"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button variant="neon-magenta" className="flex-1" onClick={handleJoin}>
                    Unirme ahora
                  </Button>
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Al unirte aceptas nuestros términos y condiciones.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

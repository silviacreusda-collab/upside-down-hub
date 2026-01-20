import { Button } from "@/components/ui/button";
import { Sparkles, Image, FileImage, Printer, Download, Share2 } from "lucide-react";

const aiFeatures = [
  {
    icon: Image,
    title: "Fotos con Personajes",
    description: "Hazte una foto virtual con Eleven, Dustin o cualquier personaje de la serie.",
  },
  {
    icon: FileImage,
    title: "Generador de Posters",
    description: "Crea posters personalizados con tu nombre en el estilo icónico de Stranger Things.",
  },
  {
    icon: Printer,
    title: "Tarjetas Imprimibles",
    description: "Diseña invitaciones, tarjetas de cumpleaños y más con temática de la serie.",
  },
];

const actions = [
  { icon: Download, label: "Descargar" },
  { icon: Printer, label: "Imprimir" },
  { icon: Share2, label: "Compartir" },
];

export const AICreativeSection = () => {
  return (
    <section id="ia" className="relative py-20 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-cyan)) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--neon-cyan)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-neon-magenta animate-pulse" />
            <span className="font-display text-neon-magenta tracking-[0.3em] text-sm">
              INTELIGENCIA ARTIFICIAL
            </span>
          </div>
          <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            CREA CON <span className="gradient-text">IA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Usa inteligencia artificial para crear contenido único de Stranger Things. 
            ¡Gratis para todos los fans!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-6">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group flex gap-4 p-4 rounded-xl hover:bg-card/50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-magenta/20 to-neon-cyan/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-neon-magenta" />
                  </div>
                  <div>
                    <h3 className="font-title text-xl text-foreground mb-1 group-hover:text-neon-magenta transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4">
              <Button asChild variant="neon-magenta" size="lg">
                <a href="#ia"><Sparkles className="w-4 h-4 mr-2" />Probar Ahora - ¡Gratis!</a>
              </Button>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative">
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-[0_0_60px_hsl(var(--neon-magenta)/0.2)]">
              {/* Preview area */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-neon-magenta/50 mx-auto mb-4" />
                  <p className="font-display text-sm text-muted-foreground tracking-wider">
                    TU CREACIÓN AQUÍ
                  </p>
                </div>
              </div>
              
              {/* Actions bar */}
              <div className="p-4 bg-card/80 backdrop-blur-sm border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Listo para compartir
                  </span>
                  <div className="flex gap-2">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-neon-magenta/20 hover:text-neon-magenta transition-colors"
                          title={action.label}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-neon-magenta/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-neon-cyan/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

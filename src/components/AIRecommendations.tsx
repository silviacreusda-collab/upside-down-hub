import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Loader2, Lightbulb, TrendingUp, Star } from "lucide-react";
import { Button } from "./ui/button";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stranger-chat`;

interface Recommendation {
  title: string;
  description: string;
  icon: "theory" | "trending" | "tip";
}

const defaultRecommendations: Recommendation[] = [
  { title: "Teoría: El destino de Vecna", description: "Los fans creen que Vecna podría redimirse en la T5. ¿Será posible?", icon: "theory" },
  { title: "Tendencia: Cosplay de Max", description: "El cosplay de Max Mayfield es el más popular este mes entre los fans españoles.", icon: "trending" },
  { title: "Dato curioso", description: "Millie Bobby Brown improvisó la escena del supermercado en la temporada 1.", icon: "tip" },
];

const iconMap = {
  theory: Lightbulb,
  trending: TrendingUp,
  tip: Star,
};

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          mode: "generate-content",
          messages: [{
            role: "user",
            content: `Genera exactamente 3 recomendaciones personalizadas para fans de Stranger Things. Responde SOLO con un JSON array así (sin markdown, sin \`\`\`, solo JSON puro):
[
  {"title": "título corto", "description": "descripción en 1 frase", "icon": "theory"},
  {"title": "título corto", "description": "descripción en 1 frase", "icon": "trending"},
  {"title": "título corto", "description": "descripción en 1 frase", "icon": "tip"}
]
Los icon posibles son: "theory", "trending", "tip". Hazlas variadas, interesantes y actuales.`
          }],
        }),
      });

      if (!resp.ok) throw new Error("Error");
      const data = await resp.json();
      
      // Parse the JSON content
      const content = data.content?.trim();
      if (content) {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length >= 3) {
            setRecommendations(parsed.slice(0, 3));
            setHasGenerated(true);
          }
        }
      }
    } catch (e) {
      console.error("Error generating recommendations:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      <div className="relative container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-neon-magenta" />
            <span className="font-display text-neon-magenta tracking-[0.3em] text-xs">
              RECOMENDACIONES IA
            </span>
          </div>
          <h2 className="font-title text-3xl md:text-4xl text-foreground mb-2">
            LA IA <span className="text-neon-magenta">RECOMIENDA</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Contenido personalizado generado por inteligencia artificial para fans como tú.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          {recommendations.map((rec, i) => {
            const Icon = iconMap[rec.icon] || Star;
            return (
              <div key={i} className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50 card-neon-hover">
                <Icon className="w-6 h-6 text-neon-magenta mb-3" />
                <h3 className="font-title text-lg text-foreground mb-1">{rec.title}</h3>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                {hasGenerated && (
                  <span className="inline-flex items-center gap-1 mt-3 text-xs text-neon-magenta/70">
                    <Sparkles className="w-3 h-3" /> Generado por IA
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={generateRecommendations}
            disabled={isLoading}
            className="border-neon-magenta/30 hover:border-neon-magenta/60"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generando...</>
            ) : (
              <><RefreshCw className="w-4 h-4 mr-2" /> {hasGenerated ? "Generar nuevas" : "Generar con IA"}</>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect } from "react";
import { Newspaper, Clock, ArrowRight, TrendingUp, X, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  trending: boolean;
  created_at: string;
  isAI?: boolean;
}

const fallbackNews: NewsItem[] = [
  {
    id: "1",
    title: "Temporada 5: Todo lo que sabemos sobre el final épico",
    excerpt: "Los hermanos Duffer confirman que la quinta temporada será la más ambiciosa hasta la fecha...",
    content: "Los hermanos Duffer han confirmado en una entrevista reciente que la quinta y última temporada de Stranger Things será la más ambiciosa de toda la serie. Con un presupuesto récord y episodios de más de una hora de duración, prometen un final que satisfará a todos los fans.\n\nSegún las declaraciones, la temporada se centrará en la batalla final contra Vecna y explorará más a fondo el origen del Upside Down. También se ha confirmado el regreso de personajes queridos y algunas sorpresas que los fans no esperan.\n\nEl rodaje está previsto para finalizar en los próximos meses, con fecha de estreno tentativa para 2025.",
    category: "Exclusiva",
    trending: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Millie Bobby Brown habla sobre el futuro de Eleven",
    excerpt: "La actriz comparte sus pensamientos sobre el viaje de su personaje y lo que viene...",
    content: "En una entrevista exclusiva, Millie Bobby Brown ha hablado sobre su experiencia interpretando a Eleven durante casi una década.\n\n\"Eleven ha sido parte de mi vida desde que era una niña. Crecer con ella ha sido increíble, y decir adiós será muy difícil\", comentó Brown.\n\nLa actriz también adelantó que el final de su personaje será \"satisfactorio y emotivo\".",
    category: "Entrevista",
    trending: false,
    created_at: new Date().toISOString(),
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Hace unos minutos";
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  return date.toLocaleDateString("es-ES");
};

export const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNews);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAIContent, setHasAIContent] = useState(false);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_generated_content")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error && data && data.length > 0) {
        const mapped: NewsItem[] = data.map((item: any) => ({
          ...item,
          isAI: true,
        }));
        setNewsItems(mapped);
        setHasAIContent(true);
      }
    } catch (e) {
      console.error("Error fetching news:", e);
    }
  };

  const generateFresh = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      if (resp.ok) {
        await fetchNews();
      }
    } catch (e) {
      console.error("Error generating:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section id="noticias" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-6 h-6 text-neon-cyan" />
              <span className="font-display text-neon-cyan tracking-[0.3em] text-sm">
                ACTUALIDAD
              </span>
              {hasAIContent && (
                <span className="flex items-center gap-1 text-xs text-neon-magenta bg-neon-magenta/10 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Generado por IA
                </span>
              )}
            </div>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground">
              ÚLTIMAS <span className="text-neon-red">NOTICIAS</span>
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={generateFresh}
            disabled={isLoading}
            className="self-start md:self-auto"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generando...</>
            ) : (
              <><RefreshCw className="w-4 h-4 mr-2" /> Actualizar con IA</>
            )}
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.slice(0, 4).map((item, index) => (
            <article
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className={`group relative bg-card rounded-xl overflow-hidden border border-border/50 card-neon-hover cursor-pointer ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`bg-gradient-to-br from-primary/20 to-accent/20 ${
                  index === 0 ? "h-48 md:h-64" : "h-32"
                }`}
              >
                {item.trending && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-neon-red/90 text-primary-foreground px-2 py-1 rounded text-xs font-display">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                )}
                {item.isAI && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-neon-magenta/90 text-primary-foreground px-2 py-1 rounded text-xs font-display">
                    <Sparkles className="w-3 h-3" />
                    IA
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-display tracking-wider text-neon-magenta">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <h3
                  className={`font-title ${
                    index === 0 ? "text-xl md:text-2xl" : "text-lg"
                  } text-foreground group-hover:text-neon-red transition-colors mb-2`}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.excerpt}
                </p>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-neon-red/10 to-transparent" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* News Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-card rounded-2xl border border-border/50 max-w-2xl w-full p-6 my-8 shadow-[0_0_60px_hsl(var(--neon-red)/0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-neon-magenta/20 text-neon-magenta text-xs font-display rounded">
                  {selectedNews.category}
                </span>
                {selectedNews.trending && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-neon-red/20 text-neon-red text-xs font-display rounded">
                    <TrendingUp className="w-3 h-3" /> Trending
                  </span>
                )}
                {selectedNews.isAI && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-neon-magenta/20 text-neon-magenta text-xs font-display rounded">
                    <Sparkles className="w-3 h-3" /> IA
                  </span>
                )}
              </div>
              <button onClick={() => setSelectedNews(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-title text-2xl md:text-3xl text-foreground mb-2">
              {selectedNews.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatDate(selectedNews.created_at)}
            </p>

            <div className="prose prose-invert max-w-none">
              {selectedNews.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
              <Button variant="neon" onClick={() => setSelectedNews(null)}>
                Cerrar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.share?.({ title: selectedNews.title, text: selectedNews.excerpt });
                }}
              >
                Compartir
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

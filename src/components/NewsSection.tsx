import { Button } from "@/components/ui/button";
import { Newspaper, Clock, ArrowRight, TrendingUp } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Temporada 5: Todo lo que sabemos sobre el final épico",
    excerpt: "Los hermanos Duffer confirman que la quinta temporada será la más ambiciosa hasta la fecha...",
    date: "Hace 2 horas",
    category: "Exclusiva",
    trending: true,
  },
  {
    id: 2,
    title: "Millie Bobby Brown habla sobre el futuro de Eleven",
    excerpt: "La actriz comparte sus pensamientos sobre el viaje de su personaje y lo que viene...",
    date: "Hace 5 horas",
    category: "Entrevista",
    trending: false,
  },
  {
    id: 3,
    title: "Nueva exposición inmersiva llega a Madrid en 2025",
    excerpt: "La experiencia Stranger Things: The Experience confirma fechas para España...",
    date: "Hace 1 día",
    category: "Eventos",
    trending: true,
  },
  {
    id: 4,
    title: "Banda sonora de la Temporada 5 filtrada parcialmente",
    excerpt: "Nuevas canciones de los 80s podrían aparecer en los episodios finales...",
    date: "Hace 2 días",
    category: "Música",
    trending: false,
  },
];

export const NewsSection = () => {
  return (
    <section id="noticias" className="relative py-20 md:py-32">
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-6 h-6 text-neon-cyan" />
              <span className="font-display text-neon-cyan tracking-[0.3em] text-sm">
                ACTUALIDAD
              </span>
            </div>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground">
              ÚLTIMAS <span className="text-neon-red">NOTICIAS</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <a href="#noticias">Ver todas <ArrowRight className="w-4 h-4 ml-2" /></a>
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <article
              key={item.id}
              className={`group relative bg-card rounded-xl overflow-hidden border border-border/50 card-neon-hover cursor-pointer ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {/* Placeholder for image */}
              <div className={`bg-gradient-to-br from-primary/20 to-accent/20 ${
                index === 0 ? "h-48 md:h-64" : "h-32"
              }`}>
                {item.trending && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-neon-red/90 text-primary-foreground px-2 py-1 rounded text-xs font-display">
                    <TrendingUp className="w-3 h-3" />
                    Trending
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
                    {item.date}
                  </span>
                </div>
                
                <h3 className={`font-title ${
                  index === 0 ? "text-xl md:text-2xl" : "text-lg"
                } text-foreground group-hover:text-neon-red transition-colors mb-2`}>
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.excerpt}
                </p>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-neon-red/10 to-transparent" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

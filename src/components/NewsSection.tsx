import { useState } from "react";
import { Newspaper, Clock, ArrowRight, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "Temporada 5: Todo lo que sabemos sobre el final épico",
    excerpt: "Los hermanos Duffer confirman que la quinta temporada será la más ambiciosa hasta la fecha...",
    content: "Los hermanos Duffer han confirmado en una entrevista reciente que la quinta y última temporada de Stranger Things será la más ambiciosa de toda la serie. Con un presupuesto récord y episodios de más de una hora de duración, prometen un final que satisfará a todos los fans.\n\nSegún las declaraciones, la temporada se centrará en la batalla final contra Vecna y explorará más a fondo el origen del Upside Down. También se ha confirmado el regreso de personajes queridos y algunas sorpresas que los fans no esperan.\n\nEl rodaje está previsto para finalizar en los próximos meses, con fecha de estreno tentativa para 2025.",
    date: "Hace 2 horas",
    category: "Exclusiva",
    trending: true,
  },
  {
    id: 2,
    title: "Millie Bobby Brown habla sobre el futuro de Eleven",
    excerpt: "La actriz comparte sus pensamientos sobre el viaje de su personaje y lo que viene...",
    content: "En una entrevista exclusiva, Millie Bobby Brown ha hablado sobre su experiencia interpretando a Eleven durante casi una década. La actriz se mostró emocionada pero también nostálgica al hablar del final de la serie.\n\n\"Eleven ha sido parte de mi vida desde que era una niña. Crecer con ella ha sido increíble, y decir adiós será muy difícil\", comentó Brown.\n\nLa actriz también adelantó que el final de su personaje será \"satisfactorio y emotivo\", aunque no dio detalles específicos para evitar spoilers.",
    date: "Hace 5 horas",
    category: "Entrevista",
    trending: false,
  },
  {
    id: 3,
    title: "Nueva exposición inmersiva llega a Madrid en 2025",
    excerpt: "La experiencia Stranger Things: The Experience confirma fechas para España...",
    content: "Netflix ha confirmado oficialmente que Stranger Things: The Experience llegará a Madrid en marzo de 2025. La exposición inmersiva, que ha sido un éxito rotundo en ciudades como Nueva York y Londres, permitirá a los fans vivir en primera persona el mundo de Hawkins.\n\nLa experiencia incluirá sets recreados de la serie, encuentros con actores caracterizados como los personajes, y una misión interactiva donde los visitantes deberán ayudar a derrotar al Demogorgon.\n\nLas entradas saldrán a la venta el próximo mes, con precios desde 35€.",
    date: "Hace 1 día",
    category: "Eventos",
    trending: true,
  },
  {
    id: 4,
    title: "Banda sonora de la Temporada 5 filtrada parcialmente",
    excerpt: "Nuevas canciones de los 80s podrían aparecer en los episodios finales...",
    content: "Según fuentes cercanas a la producción, la banda sonora de la quinta temporada incluirá varios temas icónicos de los 80s que aún no han aparecido en la serie. Entre las canciones filtradas se encuentran éxitos de Depeche Mode, The Cure y Tears for Fears.\n\nLa música siempre ha sido un elemento crucial en Stranger Things, con momentos memorables como \"Running Up That Hill\" de Kate Bush en la temporada 4.\n\nNetflix no ha confirmado ni desmentido esta información, pero los fans ya están emocionados ante la posibilidad de escuchar sus canciones favoritas de los 80s en la serie.",
    date: "Hace 2 días",
    category: "Música",
    trending: false,
  },
];

export const NewsSection = () => {
  const [selectedNews, setSelectedNews] = useState<typeof newsItems[0] | null>(null);

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
              onClick={() => setSelectedNews(item)}
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

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto" onClick={() => setSelectedNews(null)}>
          <div className="bg-card rounded-2xl border border-border/50 max-w-2xl w-full p-6 my-8 shadow-[0_0_60px_hsl(var(--neon-red)/0.3)]" onClick={(e) => e.stopPropagation()}>
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
              </div>
              <button onClick={() => setSelectedNews(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-title text-2xl md:text-3xl text-foreground mb-2">{selectedNews.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {selectedNews.date}
            </p>
            
            <div className="prose prose-invert max-w-none">
              {selectedNews.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-muted-foreground mb-4">{paragraph}</p>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6 pt-4 border-t border-border/50">
              <Button variant="neon" onClick={() => setSelectedNews(null)}>
                Cerrar
              </Button>
              <Button variant="outline" onClick={() => {
                navigator.share?.({ title: selectedNews.title, text: selectedNews.excerpt });
              }}>
                Compartir
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

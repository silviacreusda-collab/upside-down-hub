import { useState } from "react";
import { Calendar, MapPin, Clock, ArrowRight, ExternalLink, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const events = [
  {
    id: 1,
    title: "Stranger Things: The Experience Madrid",
    date: "15 Marzo 2025",
    time: "10:00 - 22:00",
    location: "IFEMA Madrid",
    type: "Experiencia",
    featured: true,
    description: "Una experiencia inmersiva única donde podrás vivir en primera persona el mundo de Stranger Things. Recorre sets recreados, conoce personajes y participa en misiones exclusivas.",
    ticketUrl: "https://www.ifema.es",
  },
  {
    id: 2,
    title: "Maratón Temporadas 1-4",
    date: "28 Febrero 2025",
    time: "18:00",
    location: "Online",
    type: "Watch Party",
    featured: false,
    description: "Únete a nuestra watch party online. Comentaremos en directo todas las temporadas con otros fans.",
    ticketUrl: "",
  },
  {
    id: 3,
    title: "Quedada Fans Barcelona",
    date: "10 Marzo 2025",
    time: "17:00",
    location: "Parc de la Ciutadella",
    type: "Meetup",
    featured: false,
    description: "Encuentra otros fans de Stranger Things en Barcelona. Trae tu mejor cosplay o ven casual.",
    ticketUrl: "",
  },
  {
    id: 4,
    title: "Concurso Cosplay ST",
    date: "22 Marzo 2025",
    time: "16:00",
    location: "Valencia",
    type: "Concurso",
    featured: false,
    description: "Concurso de cosplay con premios increíbles. ¡Demuestra tu creatividad!",
    ticketUrl: "",
  },
];

export const EventsSection = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const { toast } = useToast();

  const handleEventClick = (event: typeof events[0]) => {
    setSelectedEvent(event);
  };

  const handleRegister = (event: typeof events[0]) => {
    if (event.ticketUrl) {
      window.open(event.ticketUrl, "_blank");
    } else {
      toast({
        title: "¡Registrado!",
        description: `Te has apuntado a "${event.title}". Te enviaremos más información por email.`,
      });
    }
    setSelectedEvent(null);
  };

  return (
    <section id="eventos" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-neon-magenta" />
              <span className="font-display text-neon-magenta tracking-[0.3em] text-sm">
                PRÓXIMAMENTE
              </span>
            </div>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground">
              EVENTOS Y <span className="text-neon-red">QUEDADAS</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="self-start md:self-auto">
            <a href="#eventos">Ver calendario <ArrowRight className="w-4 h-4 ml-2" /></a>
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className={`group relative bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 card-neon-hover cursor-pointer ${
                event.featured ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              {/* Date badge */}
              <div className={`bg-gradient-to-br from-neon-red/30 to-neon-magenta/30 ${
                event.featured ? "p-8" : "p-6"
              }`}>
                <span className="inline-block px-2 py-1 bg-neon-magenta/80 text-primary-foreground text-xs font-display rounded mb-3">
                  {event.type}
                </span>
                <h3 className={`font-title ${
                  event.featured ? "text-2xl md:text-3xl" : "text-xl"
                } text-foreground group-hover:text-neon-red transition-colors`}>
                  {event.title}
                </h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neon-cyan" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neon-yellow" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neon-magenta" />
                    {event.location}
                  </div>
                </div>
                
                {event.featured && (
                  <div className="mt-4">
                    <Button variant="neon" size="sm" className="group/btn">
                      Más info
                      <ExternalLink className="w-3 h-3 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className="bg-card rounded-2xl border border-border/50 max-w-lg w-full p-6 shadow-[0_0_60px_hsl(var(--neon-red)/0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-neon-magenta/20 text-neon-magenta text-xs font-display rounded">
                {selectedEvent.type}
              </span>
              <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-title text-2xl text-foreground mb-4">{selectedEvent.title}</h3>
            
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neon-cyan" />
                {selectedEvent.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neon-yellow" />
                {selectedEvent.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neon-magenta" />
                {selectedEvent.location}
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">{selectedEvent.description}</p>
            
            <div className="flex gap-3">
              <Button variant="neon" className="flex-1" onClick={() => handleRegister(selectedEvent)}>
                {selectedEvent.ticketUrl ? "Comprar entradas" : "Apuntarme"}
              </Button>
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import { useState } from "react";
import { Trophy, Medal, Crown, Star, Users, ArrowRight, X, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const contests = [
  {
    id: 1,
    title: "Concurso de Cosplay",
    description: "Recrea tu personaje favorito y gana premios increíbles. Sube una foto de tu cosplay y participa.",
    prize: "500€ en premios",
    participants: 234,
    deadline: "15 Feb 2025",
    active: true,
    rules: "1. Sube una foto de tu cosplay\n2. Debe ser un personaje de Stranger Things\n3. Puedes participar con múltiples fotos\n4. Los ganadores se anunciarán el 20 Feb 2025",
  },
  {
    id: 2,
    title: "Fan Art del Mes",
    description: "Comparte tu arte de Stranger Things y participa. Cualquier técnica es válida.",
    prize: "Merch oficial",
    participants: 156,
    deadline: "28 Feb 2025",
    active: true,
    rules: "1. Sube tu fan art original\n2. Cualquier técnica es válida\n3. El arte debe ser original tuyo\n4. Votación comunitaria decide al ganador",
  },
  {
    id: 3,
    title: "Mejor Teoría T5",
    description: "¿Qué crees que pasará en la temporada final? Comparte tu teoría.",
    prize: "Entrada evento",
    participants: 89,
    deadline: "10 Mar 2025",
    active: true,
    rules: "1. Escribe tu teoría sobre la T5\n2. Mínimo 100 palabras\n3. Evita spoilers confirmados\n4. Las teorías más creativas ganan",
  },
];

const topUsers = [
  { name: "ElFan_Hawkins", points: 2450, badge: "🥇" },
  { name: "ElevenLover", points: 2180, badge: "🥈" },
  { name: "UpsideDownKing", points: 1920, badge: "🥉" },
  { name: "DustinHenderson", points: 1750, badge: "" },
  { name: "MaxMayfield", points: 1680, badge: "" },
];

export const ContestsSection = () => {
  const [selectedContest, setSelectedContest] = useState<typeof contests[0] | null>(null);
  const [participatedContests, setParticipatedContests] = useState<number[]>([]);
  const { toast } = useToast();

  const handleParticipate = (contest: typeof contests[0]) => {
    setParticipatedContests((prev) => [...prev, contest.id]);
    setSelectedContest(null);
    toast({
      title: "¡Participación registrada!",
      description: `Te has inscrito en "${contest.title}". ¡Mucha suerte!`,
    });
  };

  return (
    <section id="concursos" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      
      {/* Trophy decoration */}
      <div className="absolute -left-20 top-1/3 w-64 h-64 text-neon-yellow/5">
        <Trophy className="w-full h-full" />
      </div>
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-neon-yellow" />
            <span className="font-display text-neon-yellow tracking-[0.3em] text-sm">
              CONCURSOS
            </span>
          </div>
          <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            PARTICIPA Y <span className="text-neon-yellow">GANA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Demuestra tu creatividad y pasión por Stranger Things. 
            Concursos mensuales con premios increíbles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Contests */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-title text-2xl text-foreground flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-neon-yellow" />
              Concursos Activos
            </h3>
            
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="group bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 card-neon-hover"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-neon-yellow/20 text-neon-yellow text-xs font-display rounded">
                        ACTIVO
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Termina: {contest.deadline}
                      </span>
                      {participatedContests.includes(contest.id) && (
                        <span className="flex items-center gap-1 text-xs text-neon-cyan">
                          <CheckCircle className="w-3 h-3" /> Inscrito
                        </span>
                      )}
                    </div>
                    <h4 className="font-title text-xl text-foreground group-hover:text-neon-yellow transition-colors">
                      {contest.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {contest.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-neon-magenta">
                      <Medal className="w-4 h-4" />
                      <span className="font-display text-sm">{contest.prize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{contest.participants} participantes</span>
                    </div>
                    {participatedContests.includes(contest.id) ? (
                      <Button variant="outline" size="sm" className="mt-2" disabled>
                        Ya participas
                      </Button>
                    ) : (
                      <Button variant="neon" size="sm" className="mt-2" onClick={() => setSelectedContest(contest)}>
                        Participar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-neon-yellow/20 to-neon-magenta/20 p-6">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-neon-yellow" />
                <h3 className="font-title text-xl text-foreground">Top Fans</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ranking mensual</p>
            </div>
            
            <div className="p-4 space-y-2">
              {topUsers.map((user, index) => (
                <div
                  key={user.name}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <span className="w-6 text-center font-display text-lg text-muted-foreground">
                    {user.badge || (index + 1)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{user.name}</p>
                  </div>
                  <span className="font-display text-neon-yellow text-sm">
                    {user.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border/50">
              <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Ranking completo", description: "El ranking completo estará disponible próximamente." })}>
                Ver ranking completo <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Modal */}
      {selectedContest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedContest(null)}>
          <div className="bg-card rounded-2xl border border-border/50 max-w-lg w-full p-6 shadow-[0_0_60px_hsl(var(--neon-yellow)/0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-neon-yellow/20 text-neon-yellow text-xs font-display rounded">
                ACTIVO
              </span>
              <button onClick={() => setSelectedContest(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-title text-2xl text-foreground mb-2">{selectedContest.title}</h3>
            <p className="text-muted-foreground mb-4">{selectedContest.description}</p>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <h4 className="font-display text-sm text-neon-yellow mb-2">REGLAS:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedContest.rules}</p>
            </div>
            
            <div className="flex items-center justify-between mb-6 text-sm">
              <div className="flex items-center gap-2 text-neon-magenta">
                <Medal className="w-4 h-4" />
                <span>{selectedContest.prize}</span>
              </div>
              <div className="text-muted-foreground">
                Termina: {selectedContest.deadline}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="neon" className="flex-1" onClick={() => handleParticipate(selectedContest)}>
                <Trophy className="w-4 h-4 mr-2" />
                Participar ahora
              </Button>
              <Button variant="outline" onClick={() => setSelectedContest(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

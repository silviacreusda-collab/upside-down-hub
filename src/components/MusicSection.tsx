import { Button } from "@/components/ui/button";
import { Music, Mic, Play, Trophy, Volume2 } from "lucide-react";

const topSongs = [
  { title: "Running Up That Hill", artist: "Kate Bush", plays: "2.3K" },
  { title: "Should I Stay or Should I Go", artist: "The Clash", plays: "1.8K" },
  { title: "Every Breath You Take", artist: "The Police", plays: "1.5K" },
  { title: "Separate Ways", artist: "Journey", plays: "1.2K" },
];

export const MusicSection = () => {
  return (
    <section id="musica" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-hawkins-night" />
      
      {/* Vinyl record decoration */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-neon-red/20 opacity-20">
        <div className="absolute inset-8 rounded-full border-2 border-neon-red/30" />
        <div className="absolute inset-16 rounded-full border border-neon-red/40" />
        <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-neon-red/50" />
      </div>
      
      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-6 h-6 text-neon-yellow" />
                <span className="font-display text-neon-yellow tracking-[0.3em] text-sm">
                  MÚSICA Y KARAOKE
                </span>
              </div>
              <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                VIAJA A LOS <span className="text-neon-yellow">80s</span>
              </h2>
              <p className="text-muted-foreground">
                Escucha la banda sonora de la serie, canta en nuestro karaoke 
                y participa en concursos musicales. ¡Graba tu actuación!
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <Volume2 className="w-8 h-8 text-neon-yellow mb-3" />
                <h4 className="font-title text-lg text-foreground">Música Ambiente</h4>
                <p className="text-xs text-muted-foreground">Soundtrack completo</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <Mic className="w-8 h-8 text-neon-cyan mb-3" />
                <h4 className="font-title text-lg text-foreground">Karaoke</h4>
                <p className="text-xs text-muted-foreground">Graba y comparte</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <Trophy className="w-8 h-8 text-neon-magenta mb-3" />
                <h4 className="font-title text-lg text-foreground">Concursos</h4>
                <p className="text-xs text-muted-foreground">Rankings semanales</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <Play className="w-8 h-8 text-neon-red mb-3" />
                <h4 className="font-title text-lg text-foreground">En Vivo</h4>
                <p className="text-xs text-muted-foreground">24/7 streaming</p>
              </div>
            </div>

            <Button variant="neon" size="lg">
              <Music className="w-4 h-4 mr-2" />
              Escuchar Ahora
            </Button>
          </div>

          {/* Playlist Preview */}
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            {/* Player header */}
            <div className="bg-gradient-to-r from-neon-red/20 to-neon-yellow/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-neon-red/30 flex items-center justify-center">
                  <Music className="w-8 h-8 text-neon-red" />
                </div>
                <div>
                  <h4 className="font-title text-xl text-foreground">Top Canciones</h4>
                  <p className="text-sm text-muted-foreground">Lo más escuchado esta semana</p>
                </div>
              </div>
            </div>
            
            {/* Song list */}
            <div className="p-4 space-y-2">
              {topSongs.map((song, index) => (
                <div
                  key={song.title}
                  className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <span className="font-display text-lg text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center group-hover:bg-neon-red/30 transition-colors">
                    <Play className="w-4 h-4 text-muted-foreground group-hover:text-neon-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate group-hover:text-neon-red transition-colors">
                      {song.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{song.plays}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

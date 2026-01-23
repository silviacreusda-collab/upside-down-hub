import { useState } from "react";
import { Music, Mic, Play, Trophy, Volume2, Pause, Radio, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const topSongs = [
  { title: "Running Up That Hill", artist: "Kate Bush", plays: "2.3K" },
  { title: "Should I Stay or Should I Go", artist: "The Clash", plays: "1.8K" },
  { title: "Every Breath You Take", artist: "The Police", plays: "1.5K" },
  { title: "Separate Ways", artist: "Journey", plays: "1.2K" },
];

export const MusicSection = () => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePlaySong = (index: number) => {
    // This simulates playing songs from the playlist
    // The actual music plays from the MusicPlayer component at the bottom
    if (playingIndex === index) {
      setPlayingIndex(null);
      toast({
        title: "Pausado",
        description: `${topSongs[index].title} pausado.`,
      });
    } else {
      setPlayingIndex(index);
      toast({
        title: `▶ ${topSongs[index].title}`,
        description: `${topSongs[index].artist} - ¡Escúchalo en el reproductor inferior!`,
      });
      
      // Trigger the main player
      const playButton = document.querySelector('[aria-label="Reproducir"]') as HTMLButtonElement;
      if (playButton) {
        playButton.click();
      }
    }
  };

  const handleFeatureClick = (feature: string) => {
    setActiveFeature(feature);
    
    switch (feature) {
      case "Música Ambiente":
        toast({
          title: "🎵 Música Ambiente Activada",
          description: "Usa el reproductor en la parte inferior para controlar la música.",
        });
        // Trigger play
        const playBtn = document.querySelector('[aria-label="Reproducir"]') as HTMLButtonElement;
        if (playBtn) playBtn.click();
        break;
        
      case "Karaoke":
        toast({
          title: "🎤 Modo Karaoke",
          description: "El karaoke con letras sincronizadas estará disponible próximamente. ¡Mantente atento!",
        });
        break;
        
      case "Concursos":
        toast({
          title: "🏆 Concursos Musicales",
          description: "Participa en los concursos de la sección de arriba. ¡Hay premios increíbles!",
        });
        // Scroll to contests section
        document.getElementById("concursos")?.scrollIntoView({ behavior: "smooth" });
        break;
        
      case "En Vivo":
        toast({
          title: "📻 Radio en Vivo 24/7",
          description: "La radio en directo estará disponible próximamente. Por ahora, disfruta de las pistas locales.",
        });
        break;
        
      default:
        toast({
          title: `${feature} activado`,
          description: "Usa el reproductor en la parte inferior de la página.",
        });
    }
  };

  const handlePlayNow = () => {
    const playButton = document.querySelector('[aria-label="Reproducir"]') as HTMLButtonElement;
    if (playButton) {
      playButton.click();
      toast({
        title: "🎵 ¡Música activada!",
        description: "Controla la reproducción desde el player inferior.",
      });
    } else {
      toast({
        title: "Reproductor listo",
        description: "Haz clic en Play en el reproductor inferior.",
      });
    }
  };

  return (
    <section id="musica" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-hawkins-night" />
      
      {/* Vinyl record decoration */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-neon-red/20 opacity-20 animate-spin" style={{ animationDuration: '20s' }}>
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
                Escucha la banda sonora de la serie con nuestro reproductor integrado. 
                ¡Dale al Play en la barra inferior!
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div 
                onClick={() => handleFeatureClick("Música Ambiente")}
                className={`bg-card/50 backdrop-blur-sm rounded-xl p-4 border cursor-pointer transition-all ${activeFeature === "Música Ambiente" ? "border-neon-yellow/50 bg-neon-yellow/10" : "border-border/50 hover:border-neon-yellow/30"}`}
              >
                <Headphones className="w-8 h-8 text-neon-yellow mb-3" />
                <h4 className="font-title text-lg text-foreground">Música Ambiente</h4>
                <p className="text-xs text-muted-foreground">Synthwave 80s</p>
              </div>
              <div 
                onClick={() => handleFeatureClick("Karaoke")}
                className={`bg-card/50 backdrop-blur-sm rounded-xl p-4 border cursor-pointer transition-all ${activeFeature === "Karaoke" ? "border-neon-cyan/50 bg-neon-cyan/10" : "border-border/50 hover:border-neon-cyan/30"}`}
              >
                <Mic className="w-8 h-8 text-neon-cyan mb-3" />
                <h4 className="font-title text-lg text-foreground">Karaoke</h4>
                <p className="text-xs text-muted-foreground">Próximamente</p>
              </div>
              <div 
                onClick={() => handleFeatureClick("Concursos")}
                className={`bg-card/50 backdrop-blur-sm rounded-xl p-4 border cursor-pointer transition-all ${activeFeature === "Concursos" ? "border-neon-magenta/50 bg-neon-magenta/10" : "border-border/50 hover:border-neon-magenta/30"}`}
              >
                <Trophy className="w-8 h-8 text-neon-magenta mb-3" />
                <h4 className="font-title text-lg text-foreground">Concursos</h4>
                <p className="text-xs text-muted-foreground">¡Participa!</p>
              </div>
              <div 
                onClick={() => handleFeatureClick("En Vivo")}
                className={`bg-card/50 backdrop-blur-sm rounded-xl p-4 border cursor-pointer transition-all ${activeFeature === "En Vivo" ? "border-neon-red/50 bg-neon-red/10" : "border-border/50 hover:border-neon-red/30"}`}
              >
                <Radio className="w-8 h-8 text-neon-red mb-3" />
                <h4 className="font-title text-lg text-foreground">Radio 24/7</h4>
                <p className="text-xs text-muted-foreground">Próximamente</p>
              </div>
            </div>

            <Button variant="neon" size="lg" onClick={handlePlayNow}>
              <Play className="w-4 h-4 mr-2" />
              Reproducir Ahora
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
                  <p className="text-sm text-muted-foreground">Las favoritas de los fans</p>
                </div>
              </div>
            </div>
            
            {/* Song list */}
            <div className="p-4 space-y-2">
              {topSongs.map((song, index) => (
                <div
                  key={song.title}
                  onClick={() => handlePlaySong(index)}
                  className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <span className="font-display text-lg text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${playingIndex === index ? 'bg-neon-red/50' : 'bg-muted/50 group-hover:bg-neon-red/30'}`}>
                    {playingIndex === index ? (
                      <Pause className="w-4 h-4 text-neon-red" />
                    ) : (
                      <Play className="w-4 h-4 text-muted-foreground group-hover:text-neon-red" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate transition-colors ${playingIndex === index ? 'text-neon-red' : 'text-foreground group-hover:text-neon-red'}`}>
                      {song.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{song.plays}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                🎧 Usa el reproductor inferior para escuchar la música
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

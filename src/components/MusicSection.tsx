import { useState } from "react";
import { Music, Mic, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const karaokeSongs = [
  { 
    id: 1,
    title: "The Neverending Story", 
    artist: "Limahl", 
    duration: "3:28",
    lyrics: "Turn around, look at what you see...",
  },
  { 
    id: 2,
    title: "Running Up That Hill", 
    artist: "Kate Bush", 
    duration: "4:58",
    lyrics: "It doesn't hurt me...",
  },
  { 
    id: 3,
    title: "Should I Stay or Should I Go", 
    artist: "The Clash", 
    duration: "3:06",
    lyrics: "Darling you got to let me know...",
  },
  { 
    id: 4,
    title: "Every Breath You Take", 
    artist: "The Police", 
    duration: "4:13",
    lyrics: "Every breath you take, every move you make...",
  },
];

export const MusicSection = () => {
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  const [isKaraokeActive, setIsKaraokeActive] = useState(false);
  const { toast } = useToast();

  const handleSelectSong = (songId: number) => {
    const song = karaokeSongs.find(s => s.id === songId);
    if (selectedSong === songId) {
      setSelectedSong(null);
      setIsKaraokeActive(false);
    } else {
      setSelectedSong(songId);
      toast({
        title: `🎤 ${song?.title}`,
        description: `${song?.artist} - ¡Prepárate para cantar!`,
      });
    }
  };

  const handleStartKaraoke = () => {
    if (!selectedSong) {
      toast({
        title: "Selecciona una canción",
        description: "Elige una canción de la lista para empezar el karaoke.",
        variant: "destructive",
      });
      return;
    }
    
    setIsKaraokeActive(true);
    const song = karaokeSongs.find(s => s.id === selectedSong);
    toast({
      title: "🎵 ¡Karaoke iniciado!",
      description: `Cantando: ${song?.title}. ¡Próximamente con letras sincronizadas!`,
    });
    
    // Trigger ambient music player
    const playButton = document.querySelector('[aria-label="Reproducir"]') as HTMLButtonElement;
    if (playButton) playButton.click();
  };

  const handleStopKaraoke = () => {
    setIsKaraokeActive(false);
    toast({
      title: "Karaoke pausado",
      description: "Puedes continuar cuando quieras.",
    });
  };

  const selectedSongData = karaokeSongs.find(s => s.id === selectedSong);

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
                <Mic className="w-6 h-6 text-neon-yellow" />
                <span className="font-display text-neon-yellow tracking-[0.3em] text-sm">
                  KARAOKE 80s
                </span>
              </div>
              <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                CANTA LOS <span className="text-neon-yellow">CLÁSICOS</span>
              </h2>
              <p className="text-muted-foreground">
                Revive la música de Stranger Things cantando las canciones icónicas de la serie. 
                ¡Selecciona una canción y empieza tu karaoke!
              </p>
            </div>

            {/* Karaoke Preview */}
            {selectedSongData && (
              <div className={`bg-card/50 backdrop-blur-sm rounded-xl p-6 border mb-6 transition-all ${isKaraokeActive ? "border-neon-yellow/50 bg-neon-yellow/5" : "border-border/50"}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isKaraokeActive ? "bg-neon-yellow/30 animate-pulse" : "bg-neon-yellow/20"}`}>
                    <Mic className="w-6 h-6 text-neon-yellow" />
                  </div>
                  <div>
                    <h4 className="font-title text-xl text-foreground">{selectedSongData.title}</h4>
                    <p className="text-sm text-muted-foreground">{selectedSongData.artist}</p>
                  </div>
                </div>
                
                {isKaraokeActive && (
                  <div className="bg-background/50 rounded-lg p-4 mb-4">
                    <p className="text-center text-lg text-neon-yellow font-display animate-pulse">
                      🎵 {selectedSongData.lyrics} 🎵
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-2">
                      Letras sincronizadas próximamente...
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  {isKaraokeActive ? (
                    <Button variant="outline" onClick={handleStopKaraoke} className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </Button>
                  ) : (
                    <Button variant="neon" onClick={handleStartKaraoke} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      ¡Empezar Karaoke!
                    </Button>
                  )}
                </div>
              </div>
            )}

            {!selectedSongData && (
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border/50 mb-6 text-center">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Selecciona una canción de la lista para empezar
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              💡 La música ambiente suena desde el reproductor inferior
            </p>
          </div>

          {/* Song List */}
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-neon-yellow/20 to-neon-red/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-neon-yellow/30 flex items-center justify-center">
                  <Mic className="w-8 h-8 text-neon-yellow" />
                </div>
                <div>
                  <h4 className="font-title text-xl text-foreground">Canciones Karaoke</h4>
                  <p className="text-sm text-muted-foreground">Hits de Stranger Things</p>
                </div>
              </div>
            </div>
            
            {/* Song list */}
            <div className="p-4 space-y-2">
              {karaokeSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSelectSong(song.id)}
                  className={`group flex items-center gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                    selectedSong === song.id 
                      ? "bg-neon-yellow/20 border border-neon-yellow/30" 
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${
                    selectedSong === song.id 
                      ? "bg-neon-yellow/50" 
                      : "bg-muted/50 group-hover:bg-neon-yellow/30"
                  }`}>
                    {selectedSong === song.id && isKaraokeActive ? (
                      <Volume2 className="w-4 h-4 text-neon-yellow animate-pulse" />
                    ) : (
                      <Mic className="w-4 h-4 text-muted-foreground group-hover:text-neon-yellow" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate transition-colors ${
                      selectedSong === song.id ? "text-neon-yellow" : "text-foreground group-hover:text-neon-yellow"
                    }`}>
                      {song.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{song.duration}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">
                🎤 Selecciona una canción y canta con nosotros
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useEffect, useMemo, useRef, useState } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";

const playlist = [
  {
    title: "80s Retro Synthwave",
    artist: "Royalty-free",
    duration: "—",
    src: "https://cdn.pixabay.com/audio/2024/01/18/audio_277332f183.mp3",
  },
  {
    title: "Dark Ambient",
    artist: "Royalty-free",
    duration: "—",
    src: "https://cdn.pixabay.com/audio/2022/05/04/audio_3d1f0a0342.mp3",
  },
  {
    title: "Synth Pulse",
    artist: "Royalty-free",
    duration: "—",
    src: "https://cdn.pixabay.com/audio/2022/03/23/audio_097fdc7624.mp3",
  },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const current = useMemo(() => playlist[currentTrack], [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = current.src;
    audio.load();

    if (isPlaying) {
      // Attempt autoplay when user already interacted
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [current.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const toggleMute = () => setIsMuted((m) => !m);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % playlist.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-primary/30">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" loop crossOrigin="anonymous" />

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neon-red/30 to-neon-magenta/30 flex items-center justify-center flex-shrink-0">
              <Music className={`w-5 h-5 md:w-6 md:h-6 text-neon-red ${isPlaying ? "animate-pulse" : ""}`} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm md:text-base truncate">{current.title}</p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{current.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={prevTrack}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors hidden sm:block"
              aria-label="Pista anterior"
            >
              <SkipBack className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neon-red flex items-center justify-center hover:bg-neon-red/80 transition-colors shadow-[0_0_20px_hsl(var(--neon-red)/0.5)]"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground ml-0.5" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors hidden sm:block"
              aria-label="Siguiente pista"
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-neon-cyan" />
              )}
            </button>
            <div className="hidden md:block w-32 h-1 bg-muted rounded-full overflow-hidden">
              <div className={`h-full bg-neon-red rounded-full transition-all ${isPlaying ? "w-1/3 animate-pulse" : "w-0"}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


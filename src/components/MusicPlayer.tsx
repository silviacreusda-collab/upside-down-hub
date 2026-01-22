import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const playlist = [
  {
    title: "80s Retro Synthwave",
    artist: "Ambiente 80s",
    src: "/audio/track-1.mp3",
  },
  {
    title: "Dark Ambient",
    artist: "Upside Down",
    src: "/audio/track-2.mp3",
  },
  {
    title: "Synth Pulse",
    artist: "Hawkins Lab",
    src: "/audio/track-3.mp3",
  },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorStreak, setErrorStreak] = useState(0);
  const { toast } = useToast();

  const current = playlist[currentTrack];

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = false;
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    // Handle track end
    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    // Handle time update for progress
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    // Handle errors
    const handleError = () => {
      // If a track fails to load/play, try the next one. If all fail, stop.
      console.error("Audio error, trying next track");
      setErrorStreak((prev) => {
        const next = prev + 1;
        if (next >= playlist.length) {
          setIsPlaying(false);
        } else {
          setCurrentTrack((t) => (t + 1) % playlist.length);
        }
        return next;
      });
    };

    const handleCanPlay = () => {
      // Reset error streak when a track can be played
      setErrorStreak(0);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Load new track when currentTrack changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = current.src;
    audio.load();
    setProgress(0);

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, current.src]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
          toast({
            title: "Haz clic en Play",
            description: "El navegador requiere interacción para reproducir audio.",
          });
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, toast]);

  // Handle mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m);
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    toast({
      title: "Siguiente pista",
      description: playlist[(currentTrack + 1) % playlist.length].title,
    });
  }, [currentTrack, toast]);

  const prevTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    toast({
      title: "Pista anterior",
      description: playlist[(currentTrack - 1 + playlist.length) % playlist.length].title,
    });
  }, [currentTrack, toast]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-primary/30">
      {/* Progress bar */}
      <div className="h-1 bg-muted/50">
        <div
          className="h-full bg-gradient-to-r from-neon-red to-neon-magenta transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

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
            <span className="hidden md:block text-xs text-muted-foreground font-display">
              {currentTrack + 1}/{playlist.length}
            </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

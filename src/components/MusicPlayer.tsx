import { useState } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

const playlist = [
  { title: "Running Up That Hill", artist: "Kate Bush", duration: "5:03" },
  { title: "Should I Stay or Should I Go", artist: "The Clash", duration: "3:07" },
  { title: "Every Breath You Take", artist: "The Police", duration: "4:13" },
  { title: "Separate Ways", artist: "Journey", duration: "5:25" },
  { title: "Hazy Shade of Winter", artist: "The Bangles", duration: "3:42" },
  { title: "Africa", artist: "Toto", duration: "4:55" },
];

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % playlist.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-primary/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neon-red/30 to-neon-magenta/30 flex items-center justify-center flex-shrink-0">
              <Music className={`w-5 h-5 md:w-6 md:h-6 text-neon-red ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm md:text-base truncate">
                {playlist[currentTrack].title}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {playlist[currentTrack].artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={prevTrack}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors hidden sm:block"
            >
              <SkipBack className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neon-red flex items-center justify-center hover:bg-neon-red/80 transition-colors shadow-[0_0_20px_hsl(var(--neon-red)/0.5)]"
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
            >
              <SkipForward className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
            </button>
          </div>

          {/* Volume & Duration */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="text-xs text-muted-foreground hidden md:block">
              {playlist[currentTrack].duration}
            </span>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5 text-neon-cyan" />
              )}
            </button>
            {/* Progress bar */}
            <div className="hidden md:block w-32 h-1 bg-muted rounded-full overflow-hidden">
              <div className={`h-full bg-neon-red rounded-full transition-all ${isPlaying ? 'w-1/3 animate-pulse' : 'w-0'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

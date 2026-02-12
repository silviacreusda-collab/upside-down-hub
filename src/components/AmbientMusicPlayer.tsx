import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
}

const tracks: Track[] = [
  { id: 1, title: "Stranger Things Theme", artist: "Kyle Dixon & Michael Stein", src: "/audio/track-1.mp3" },
  { id: 2, title: "Kids", artist: "Kyle Dixon & Michael Stein", src: "/audio/track-2.mp3" },
  { id: 3, title: "Eulogy", artist: "Kyle Dixon & Michael Stein", src: "/audio/track-3.mp3" },
];

export const AmbientMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = tracks[currentTrack].src;
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => nextTrack();

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % tracks.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);

  const seek = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = val[0];
    setProgress(val[0]);
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section id="musica" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music className="w-6 h-6 text-neon-cyan" />
            <h2 className="font-title text-3xl md:text-4xl tracking-[0.15em] text-foreground">
              MÚSICA AMBIENTE
            </h2>
            <Music className="w-6 h-6 text-neon-cyan" />
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sumérgete en la atmósfera del Upside Down con la banda sonora original de la serie.
          </p>
        </div>

        {/* Player Card */}
        <div className="rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_40px_hsl(var(--neon-red)/0.1)]">
          {/* Track List */}
          <div className="space-y-2 mb-8">
            {tracks.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrack(idx);
                  setIsPlaying(true);
                  setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-300 text-left ${
                  idx === currentTrack
                    ? "bg-primary/15 border border-primary/40 shadow-[0_0_15px_hsl(var(--neon-red)/0.15)]"
                    : "hover:bg-muted/30 border border-transparent"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  idx === currentTrack ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {idx === currentTrack && isPlaying ? (
                    <div className="flex gap-[2px] items-end h-3">
                      <span className="w-[3px] bg-primary-foreground animate-pulse" style={{ height: "60%", animationDelay: "0ms" }} />
                      <span className="w-[3px] bg-primary-foreground animate-pulse" style={{ height: "100%", animationDelay: "150ms" }} />
                      <span className="w-[3px] bg-primary-foreground animate-pulse" style={{ height: "40%", animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${idx === currentTrack ? "text-primary" : "text-foreground"}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Now Playing */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Reproduciendo</p>
            <p className="font-display text-lg text-foreground">{tracks[currentTrack].title}</p>
            <p className="text-sm text-muted-foreground">{tracks[currentTrack].artist}</p>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <Slider
              value={[progress]}
              max={duration || 100}
              step={0.5}
              onValueChange={seek}
              className="cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
              <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={prevTrack}>
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="neon"
              size="icon"
              className="w-14 h-14 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={nextTrack}>
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 max-w-xs mx-auto">
            <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-foreground transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={(v) => { setVolume(v[0]); setIsMuted(false); }}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} preload="auto" />
    </section>
  );
};

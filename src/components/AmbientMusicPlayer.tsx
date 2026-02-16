import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AmbientSound {
  id: number;
  title: string;
  description: string;
  // Web Audio API generated sounds
  type: "wind" | "static" | "drone" | "whispers" | "rain";
}

const ambientSounds: AmbientSound[] = [
  { id: 1, title: "Viento del Upside Down", description: "Viento oscuro y sobrenatural", type: "wind" },
  { id: 2, title: "Estática Dimensional", description: "Interferencia entre dimensiones", type: "static" },
  { id: 3, title: "Drone Oscuro", description: "Atmósfera tensa y misteriosa", type: "drone" },
  { id: 4, title: "Susurros del Vacío", description: "Ecos del otro lado", type: "whispers" },
  { id: 5, title: "Lluvia en Hawkins", description: "Tormenta nocturna en Indiana", type: "rain" },
];

// Generate ambient sounds using Web Audio API
class AmbientGenerator {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private isActive = false;

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.connect(this.ctx.destination);
    this.gainNode.gain.value = 0.3;
  }

  setVolume(v: number) {
    if (this.gainNode) this.gainNode.gain.value = v;
  }

  stop() {
    this.nodes.forEach((n) => { try { (n as OscillatorNode).stop?.(); } catch {} });
    this.nodes = [];
    this.isActive = false;
  }

  play(type: AmbientSound["type"]) {
    if (!this.ctx || !this.gainNode) this.init();
    this.stop();
    this.isActive = true;

    const ctx = this.ctx!;
    const dest = this.gainNode!;

    switch (type) {
      case "wind": this.createWind(ctx, dest); break;
      case "static": this.createStatic(ctx, dest); break;
      case "drone": this.createDrone(ctx, dest); break;
      case "whispers": this.createWhispers(ctx, dest); break;
      case "rain": this.createRain(ctx, dest); break;
    }
  }

  private createNoise(ctx: AudioContext): AudioBufferSourceNode {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start();
    this.nodes.push(source);
    return source;
  }

  private createWind(ctx: AudioContext, dest: AudioNode) {
    const noise = this.createNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 1;
    // Modulate wind
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.nodes.push(lfo);

    const gain = ctx.createGain();
    gain.gain.value = 0.6;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
  }

  private createStatic(ctx: AudioContext, dest: AudioNode) {
    const noise = this.createNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.value = 0.15;
    // Intermittent effect
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.1;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();
    this.nodes.push(lfo);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
  }

  private createDrone(ctx: AudioContext, dest: AudioNode) {
    [55, 82.5, 110, 165].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i < 2 ? "sine" : "triangle";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      gain.gain.value = i === 0 ? 0.3 : 0.1;
      // Subtle detune
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.02;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start();
      osc.connect(gain);
      gain.connect(dest);
      osc.start();
      this.nodes.push(osc, lfo);
    });
  }

  private createWhispers(ctx: AudioContext, dest: AudioNode) {
    // Filtered noise + resonant sweeps
    const noise = this.createNoise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1500;
    filter.Q.value = 8;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 1000;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.nodes.push(lfo);

    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    // Add subtle drone underneath
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 80;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.15;
    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start();
    this.nodes.push(osc);
  }

  private createRain(ctx: AudioContext, dest: AudioNode) {
    // Filtered noise for rain
    const noise = this.createNoise(ctx);
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 8000;
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 400;
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    noise.connect(hpf);
    hpf.connect(lpf);
    lpf.connect(gain);
    gain.connect(dest);

    // Thunder rumble (low frequency)
    const thunder = ctx.createOscillator();
    thunder.type = "sine";
    thunder.frequency.value = 40;
    const tGain = ctx.createGain();
    tGain.gain.value = 0.1;
    const tLfo = ctx.createOscillator();
    tLfo.frequency.value = 0.08;
    const tLfoGain = ctx.createGain();
    tLfoGain.gain.value = 0.1;
    tLfo.connect(tLfoGain);
    tLfoGain.connect(tGain.gain);
    tLfo.start();
    thunder.connect(tGain);
    tGain.connect(dest);
    thunder.start();
    this.nodes.push(thunder, tLfo);
  }

  get playing() { return this.isActive; }
}

const generator = new AmbientGenerator();

export const AmbientMusicPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    generator.setVolume(isMuted ? 0 : volume / 100 * 0.5);
  }, [volume, isMuted]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      generator.stop();
      setIsPlaying(false);
    } else {
      generator.play(ambientSounds[currentTrack].type);
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  const selectTrack = useCallback((idx: number) => {
    setCurrentTrack(idx);
    generator.play(ambientSounds[idx].type);
    setIsPlaying(true);
  }, []);

  const nextTrack = () => selectTrack((currentTrack + 1) % ambientSounds.length);
  const prevTrack = () => selectTrack((currentTrack - 1 + ambientSounds.length) % ambientSounds.length);

  return (
    <section id="musica" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Waves className="w-6 h-6 text-neon-cyan" />
            <span className="font-display text-neon-cyan tracking-[0.3em] text-sm">
              SONIDOS AMBIENTALES
            </span>
          </div>
          <h2 className="font-title text-3xl md:text-4xl tracking-[0.15em] text-foreground">
            ATMÓSFERA DEL <span className="text-neon-red">UPSIDE DOWN</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-2">
            Sonidos atmosféricos generados en tiempo real. Sumérgete en la oscuridad de Hawkins.
          </p>
        </div>

        {/* Player Card */}
        <div className="rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-sm p-6 md:p-8 shadow-[0_0_40px_hsl(var(--neon-red)/0.1)]">
          {/* Sound List */}
          <div className="space-y-2 mb-8">
            {ambientSounds.map((sound, idx) => (
              <button
                key={sound.id}
                onClick={() => selectTrack(idx)}
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
                    <Waves className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${idx === currentTrack ? "text-primary" : "text-foreground"}`}>
                    {sound.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{sound.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Now Playing */}
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              {isPlaying ? "Reproduciendo" : "Selecciona un sonido"}
            </p>
            <p className="font-display text-lg text-foreground">{ambientSounds[currentTrack].title}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={prevTrack}>
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button variant="neon" size="icon" className="w-14 h-14 rounded-full" onClick={togglePlay}>
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
    </section>
  );
};

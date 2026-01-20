import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import bg1 from "@/assets/bg-rotator-1.jpg";
import bg2 from "@/assets/bg-rotator-2.jpg";
import { BackgroundRotator } from "./BackgroundRotator";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image rotator */}
      <BackgroundRotator
        images={[heroBackground, bg1, bg2]}
        className="absolute inset-0"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 vignette" />
      
      {/* Red glow from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/30 via-primary/10 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Subtitle */}
          <p className="font-display text-neon-cyan tracking-[0.3em] text-sm md:text-base animate-fade-in">
            WEB FAN NO OFICIAL
          </p>
          
          {/* Main Title */}
          <h1 className="stranger-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none">
            <span className="text-neon-red animate-flicker drop-shadow-[0_0_30px_hsl(var(--neon-red))]">
              STRANGER
            </span>
            <br />
            <span className="text-foreground drop-shadow-[0_0_20px_hsl(var(--foreground)/0.5)]">
              THINGS
            </span>
          </h1>
          
          {/* Spanish Fan Hub Badge */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-neon-magenta/50" />
            <span className="font-display text-neon-magenta tracking-[0.4em] text-xs md:text-sm">
              FAN HUB ESPAÑA
            </span>
            <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-neon-magenta/50" />
          </div>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto animate-slide-up drop-shadow-lg">
            El punto de encuentro definitivo para los fans de Stranger Things en España. 
            Noticias, comunidad, creatividad con IA y mucho más.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up">
            <Button asChild variant="hero" size="xl">
              <a href="#noticias">Explorar Ahora</a>
            </Button>
            <Button asChild variant="neon-cyan" size="lg">
              <a href="#comunidad">Unirse a la Comunidad</a>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 max-w-lg mx-auto">
            <div className="text-center backdrop-blur-sm bg-background/20 rounded-lg p-3">
              <div className="font-title text-3xl md:text-4xl text-neon-red drop-shadow-[0_0_10px_hsl(var(--neon-red))]">10K+</div>
              <div className="text-xs md:text-sm text-foreground/70">Fans</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-background/20 rounded-lg p-3">
              <div className="font-title text-3xl md:text-4xl text-neon-cyan drop-shadow-[0_0_10px_hsl(var(--neon-cyan))]">500+</div>
              <div className="text-xs md:text-sm text-foreground/70">Creaciones</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-background/20 rounded-lg p-3">
              <div className="font-title text-3xl md:text-4xl text-neon-magenta drop-shadow-[0_0_10px_hsl(var(--neon-magenta))]">24/7</div>
              <div className="text-xs md:text-sm text-foreground/70">Activo</div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#noticias" aria-label="Bajar a noticias">
            <ChevronDown className="w-8 h-8 text-neon-red/70" />
          </a>
        </div>
      </div>
    </section>
  );
};


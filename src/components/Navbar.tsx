import { useState } from "react";
import { Menu, X, Users, Newspaper, Calendar, ShoppingBag, Music, Trophy, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { label: "Noticias", href: "#noticias", icon: Newspaper },
  { label: "Eventos", href: "#eventos", icon: Calendar },
  { label: "Merch", href: "#merch", icon: ShoppingBag },
  { label: "Comunidad", href: "#comunidad", icon: Users },
  { label: "IA", href: "#ia", icon: Sparkles },
  { label: "Música", href: "#musica", icon: Music },
  { label: "Concursos", href: "#concursos", icon: Trophy },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <span className="font-title text-2xl md:text-3xl tracking-[0.2em] text-neon-red animate-flicker">
              STRANGER FANS
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">ESPAÑA</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-display tracking-wider text-foreground/70 hover:text-neon-red transition-colors duration-300 hover:drop-shadow-[0_0_10px_hsl(var(--neon-red))]"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="neon" size="sm">
              Únete
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground hover:text-neon-red transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-primary/20 animate-slide-up">
            <div className="container px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-lg font-display tracking-wider text-foreground/70 hover:text-neon-red hover:bg-primary/5 rounded-lg transition-all duration-300"
                  >
                    <Icon size={20} className="text-neon-red/50" />
                    {item.label}
                  </a>
                );
              })}
              <div className="pt-4">
                <Button variant="neon" className="w-full">
                  Únete a la Comunidad
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

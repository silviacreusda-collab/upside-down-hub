import { Zap, Mail, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-upside-down border-t border-primary/20">
      {/* Red glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-red/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-neon-red" />
              <span className="font-title text-2xl tracking-[0.2em] text-neon-red">
                STRANGER FANS
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              La mayor comunidad de fans de Stranger Things en España. 
              Contenido actualizado diariamente con IA. 
              Un proyecto hecho por fans, para fans.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-neon-red/20 hover:text-neon-red transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-neon-magenta/20 hover:text-neon-magenta transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-title text-lg text-foreground mb-4">Explorar</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">Noticias</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">Eventos</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">Merchandising</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">Comunidad</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-title text-lg text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">Aviso Legal</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">Cookies</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-red transition-colors">DMCA</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border/50 pt-8">
          <div className="bg-card/30 rounded-lg p-4 mb-6">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-neon-red">AVISO IMPORTANTE:</strong> Este es un sitio web de fans NO OFICIAL. 
              Stranger Things™ es una marca registrada de Netflix. Todos los derechos sobre la serie, 
              personajes, imágenes y contenido relacionado pertenecen a sus respectivos propietarios. 
              Este sitio no está afiliado, patrocinado ni respaldado por Netflix o los creadores de Stranger Things.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Stranger Fans España. Hecho con 💜 para fans, por fans.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Actualizado automáticamente con IA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

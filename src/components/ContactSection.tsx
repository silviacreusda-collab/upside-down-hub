import { useState } from "react";
import { Mail, Send, User, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor, introduce tu nombre.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      toast({
        title: "Mensaje muy corto",
        description: "Por favor, escribe un mensaje de al menos 10 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSent(true);
    setFormData({ name: "", email: "", message: "" });
    
    toast({
      title: "¡Mensaje enviado!",
      description: "Te responderemos lo antes posible. Gracias por contactarnos.",
    });
  };

  if (isSent) {
    return (
      <section id="contacto" className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-12 border border-neon-cyan/30">
              <CheckCircle className="w-20 h-20 text-neon-cyan mx-auto mb-6" />
              <h2 className="font-title text-4xl text-foreground mb-4">
                ¡MENSAJE <span className="text-neon-cyan">ENVIADO</span>!
              </h2>
              <p className="text-muted-foreground mb-8">
                Gracias por contactarnos. Te responderemos lo antes posible.
              </p>
              <Button 
                variant="neon-cyan" 
                size="lg"
                onClick={() => setIsSent(false)}
              >
                Enviar otro mensaje
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="relative py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-neon-cyan" />
              <span className="font-display text-neon-cyan tracking-[0.3em] text-sm">
                CONTACTO
              </span>
            </div>
            <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              ¿TIENES <span className="text-neon-magenta">PREGUNTAS</span>?
            </h2>
            <p className="text-muted-foreground">
              Escríbenos y te responderemos lo antes posible. ¡Estamos aquí para ayudarte!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full pl-12 pr-4 py-4 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-red/50 focus:shadow-[0_0_20px_hsl(var(--neon-red)/0.2)] transition-all"
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-red/50 focus:shadow-[0_0_20px_hsl(var(--neon-red)/0.2)] transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tu mensaje... (mínimo 10 caracteres)"
                rows={5}
                className="w-full pl-12 pr-4 py-4 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-red/50 focus:shadow-[0_0_20px_hsl(var(--neon-red)/0.2)] transition-all resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Contact info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-card/30 rounded-xl p-4 border border-border/50">
              <Mail className="w-6 h-6 text-neon-red mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">contacto@strangerfans.es</p>
            </div>
            <div className="bg-card/30 rounded-xl p-4 border border-border/50">
              <span className="text-2xl">📍</span>
              <p className="text-sm text-muted-foreground mt-1">España</p>
            </div>
            <div className="bg-card/30 rounded-xl p-4 border border-border/50">
              <span className="text-2xl">⏰</span>
              <p className="text-sm text-muted-foreground mt-1">24-48h respuesta</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor, introduce tu email.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail("");
    
    toast({
      title: "¡Suscripción exitosa!",
      description: "Te has unido a la comunidad Stranger Fans.",
    });
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl">
        <CheckCircle className="w-5 h-5 text-neon-cyan" />
        <span className="text-sm text-neon-cyan">¡Gracias! Estás en la lista.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full pl-10 pr-4 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-red/50 focus:shadow-[0_0_20px_hsl(var(--neon-red)/0.2)] transition-all"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        variant="neon" 
        disabled={isLoading}
        className="whitespace-nowrap"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uniendo...
          </>
        ) : (
          "Unirse"
        )}
      </Button>
    </form>
  );
};

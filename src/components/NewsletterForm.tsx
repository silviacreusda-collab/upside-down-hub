import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Email inválido", description: "Por favor, introduce un email válido.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("community_members").insert({
        email: email.trim().toLowerCase(),
        name: null,
      });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Ya estás registrado", description: "Este email ya forma parte de la comunidad." });
        } else {
          throw error;
        }
      }

      setIsSubscribed(true);
      setEmail("");
      toast({ title: "¡Suscripción exitosa!", description: "Te has unido a Stranger Fans. Recibirás las últimas noticias." });
    } catch (error) {
      console.error("Newsletter error:", error);
      toast({ title: "Error", description: "Hubo un problema. Intenta de nuevo.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center gap-3 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl">
        <CheckCircle className="w-6 h-6 text-neon-cyan" />
        <div className="text-left">
          <p className="text-sm font-medium text-neon-cyan">¡Gracias por suscribirte!</p>
          <p className="text-xs text-muted-foreground">Recibirás noticias exclusivas pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full pl-10 pr-4 py-3 bg-card/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-red/50 focus:shadow-[0_0_20px_hsl(var(--neon-red)/0.2)] transition-all" disabled={isLoading} />
      </div>
      <Button type="submit" variant="neon" disabled={isLoading} className="whitespace-nowrap">
        {isLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uniendo...</>) : "Unirse ahora"}
      </Button>
    </form>
  );
};

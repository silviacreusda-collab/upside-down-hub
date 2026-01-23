import { useState } from "react";
import { Trophy, Medal, Crown, Star, Users, ArrowRight, X, CheckCircle, Mail, User, Loader2, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contests = [
  {
    id: "cosplay-2025",
    title: "Concurso de Cosplay",
    description: "Recrea tu personaje favorito y gana premios increíbles. Sube una foto de tu cosplay.",
    prize: "500€ en premios",
    participants: 234,
    deadline: "15 Feb 2025",
    active: true,
    requiresPhoto: true,
    rules: "1. Sube una foto de tu cosplay\n2. Debe ser un personaje de Stranger Things\n3. Puedes participar con múltiples fotos\n4. Los ganadores se anunciarán el 20 Feb 2025",
  },
  {
    id: "fanart-feb-2025",
    title: "Fan Art del Mes",
    description: "Comparte tu arte de Stranger Things. Cualquier técnica es válida.",
    prize: "Merch oficial",
    participants: 156,
    deadline: "28 Feb 2025",
    active: true,
    requiresPhoto: true,
    rules: "1. Sube tu fan art original\n2. Cualquier técnica es válida\n3. El arte debe ser original tuyo\n4. Votación comunitaria decide al ganador",
  },
  {
    id: "teoria-t5",
    title: "Mejor Teoría T5",
    description: "¿Qué crees que pasará en la temporada final? Comparte tu teoría.",
    prize: "Entrada evento",
    participants: 89,
    deadline: "10 Mar 2025",
    active: true,
    requiresText: true,
    rules: "1. Escribe tu teoría sobre la T5\n2. Mínimo 100 palabras\n3. Evita spoilers confirmados\n4. Las teorías más creativas ganan",
  },
];

const topUsers = [
  { name: "ElFan_Hawkins", points: 2450, badge: "🥇" },
  { name: "ElevenLover", points: 2180, badge: "🥈" },
  { name: "UpsideDownKing", points: 1920, badge: "🥉" },
  { name: "DustinHenderson", points: 1750, badge: "" },
  { name: "MaxMayfield", points: 1680, badge: "" },
];

export const ContestsSection = () => {
  const [selectedContest, setSelectedContest] = useState<typeof contests[0] | null>(null);
  const [participatedContests, setParticipatedContests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form fields
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [submissionPhoto, setSubmissionPhoto] = useState<string | null>(null);
  
  const { toast } = useToast();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "La imagen debe ser menor de 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setSubmissionPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParticipate = async () => {
    if (!selectedContest) return;
    
    // Validation
    if (!participantName.trim()) {
      toast({ title: "Nombre requerido", description: "Por favor, introduce tu nombre.", variant: "destructive" });
      return;
    }
    
    if (!participantEmail.trim() || !validateEmail(participantEmail)) {
      toast({ title: "Email inválido", description: "Por favor, introduce un email válido.", variant: "destructive" });
      return;
    }
    
    if (selectedContest.requiresPhoto && !submissionPhoto) {
      toast({ title: "Foto requerida", description: "Este concurso requiere subir una foto.", variant: "destructive" });
      return;
    }
    
    if (selectedContest.requiresText && submissionText.length < 100) {
      toast({ title: "Texto muy corto", description: "La teoría debe tener al menos 100 caracteres.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error } = await supabase.from("contest_participants").insert({
        contest_id: selectedContest.id,
        name: participantName.trim(),
        email: participantEmail.trim().toLowerCase(),
        submission_url: submissionPhoto || null,
        submission_text: submissionText || null,
      });

      if (error) throw error;

      setParticipatedContests((prev) => [...prev, selectedContest.id]);
      
      toast({
        title: "¡Participación registrada!",
        description: `Te has inscrito en "${selectedContest.title}". Recibirás información en ${participantEmail}.`,
      });
      
      // Reset form
      setSelectedContest(null);
      setParticipantName("");
      setParticipantEmail("");
      setSubmissionText("");
      setSubmissionPhoto(null);
      
    } catch (error) {
      console.error("Error registering:", error);
      toast({
        title: "Error al registrar",
        description: "Hubo un problema. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedContest(null);
    setParticipantName("");
    setParticipantEmail("");
    setSubmissionText("");
    setSubmissionPhoto(null);
  };

  return (
    <section id="concursos" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />
      
      {/* Trophy decoration */}
      <div className="absolute -left-20 top-1/3 w-64 h-64 text-neon-yellow/5">
        <Trophy className="w-full h-full" />
      </div>
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-neon-yellow" />
            <span className="font-display text-neon-yellow tracking-[0.3em] text-sm">
              CONCURSOS
            </span>
          </div>
          <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            PARTICIPA Y <span className="text-neon-yellow">GANA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Demuestra tu creatividad y pasión por Stranger Things. 
            ¡Rellena el formulario para participar y ganar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Contests */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-title text-2xl text-foreground flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-neon-yellow" />
              Concursos Activos
            </h3>
            
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="group bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 card-neon-hover"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-neon-yellow/20 text-neon-yellow text-xs font-display rounded">
                        ACTIVO
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Termina: {contest.deadline}
                      </span>
                      {participatedContests.includes(contest.id) && (
                        <span className="flex items-center gap-1 text-xs text-neon-cyan">
                          <CheckCircle className="w-3 h-3" /> Inscrito
                        </span>
                      )}
                    </div>
                    <h4 className="font-title text-xl text-foreground group-hover:text-neon-yellow transition-colors">
                      {contest.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {contest.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-neon-magenta">
                      <Medal className="w-4 h-4" />
                      <span className="font-display text-sm">{contest.prize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">{contest.participants} participantes</span>
                    </div>
                    {participatedContests.includes(contest.id) ? (
                      <Button variant="outline" size="sm" className="mt-2" disabled>
                        <CheckCircle className="w-4 h-4 mr-1" /> Ya participas
                      </Button>
                    ) : (
                      <Button variant="neon" size="sm" className="mt-2" onClick={() => setSelectedContest(contest)}>
                        Participar <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
            <div className="bg-gradient-to-r from-neon-yellow/20 to-neon-magenta/20 p-6">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-neon-yellow" />
                <h3 className="font-title text-xl text-foreground">Top Fans</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ranking mensual</p>
            </div>
            
            <div className="p-4 space-y-2">
              {topUsers.map((user, index) => (
                <div
                  key={user.name}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <span className="w-6 text-center font-display text-lg text-muted-foreground">
                    {user.badge || (index + 1)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{user.name}</p>
                  </div>
                  <span className="font-display text-neon-yellow text-sm">
                    {user.points.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                ¡Participa para aparecer en el ranking!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Participation Modal */}
      {selectedContest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-card rounded-2xl border border-border/50 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-[0_0_60px_hsl(var(--neon-yellow)/0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-neon-yellow/20 text-neon-yellow text-xs font-display rounded">
                INSCRIPCIÓN
              </span>
              <button onClick={closeModal} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="font-title text-2xl text-foreground mb-2">{selectedContest.title}</h3>
            <p className="text-muted-foreground mb-4">{selectedContest.description}</p>
            
            {/* Rules */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <h4 className="font-display text-sm text-neon-yellow mb-2">REGLAS:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedContest.rules}</p>
            </div>
            
            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-yellow/50"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Tu Email *
                </label>
                <input
                  type="email"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-yellow/50"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">Recibirás información del concurso aquí.</p>
              </div>
              
              {selectedContest.requiresPhoto && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Tu Foto/Imagen *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="contest-photo-upload"
                    disabled={isSubmitting}
                  />
                  {submissionPhoto ? (
                    <div className="relative">
                      <img src={submissionPhoto} alt="Submission" className="w-full h-32 object-cover rounded-lg" />
                      <button 
                        onClick={() => setSubmissionPhoto(null)}
                        className="absolute top-2 right-2 p-1 bg-destructive rounded-full"
                      >
                        <X className="w-4 h-4 text-destructive-foreground" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="contest-photo-upload"
                      className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-neon-yellow/50 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Subir imagen</span>
                    </label>
                  )}
                </div>
              )}
              
              {selectedContest.requiresText && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tu Teoría * (mínimo 100 caracteres)
                  </label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Escribe tu teoría aquí..."
                    rows={4}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-yellow/50 resize-none"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{submissionText.length}/100 caracteres mínimos</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-6 text-sm">
              <div className="flex items-center gap-2 text-neon-magenta">
                <Medal className="w-4 h-4" />
                <span>{selectedContest.prize}</span>
              </div>
              <div className="text-muted-foreground">
                Termina: {selectedContest.deadline}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="neon" 
                className="flex-1" 
                onClick={handleParticipate}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-2" />
                    Participar ahora
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

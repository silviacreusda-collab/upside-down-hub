import { useState, useRef } from "react";
import { Sparkles, Image, FileImage, Printer, Download, Share2, Loader2, RefreshCw, Upload, User, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const aiFeatures = [
  {
    icon: Image,
    title: "Fotos con Personajes",
    description: "Sube tu foto y aparece junto a Eleven, Dustin o cualquier personaje de la serie.",
    action: "foto",
    result: "¡Tu foto con personajes de Stranger Things está lista!",
    requiresPhoto: true,
  },
  {
    icon: FileImage,
    title: "Generador de Posters",
    description: "Crea posters personalizados con tu foto y nombre en el estilo icónico de Stranger Things.",
    action: "poster",
    result: "Tu póster personalizado de Stranger Things está listo.",
    requiresPhoto: false,
    requiresName: true,
  },
  {
    icon: Printer,
    title: "Tarjetas de Cumpleaños",
    description: "Diseña tarjetas personalizadas con nombre, fecha y tu foto como protagonista.",
    action: "tarjeta",
    result: "Tu tarjeta temática está lista para imprimir.",
    requiresPhoto: false,
    requiresName: true,
    requiresDate: true,
  },
];

const actions = [
  { icon: Download, label: "Descargar", message: "Descarga iniciada." },
  { icon: Printer, label: "Imprimir", message: "Abriendo diálogo de impresión..." },
  { icon: Share2, label: "Compartir", message: "¡Compártelo en tus redes!" },
];

export const AICreativeSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  
  // Form fields
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setUserPhoto(event.target?.result as string);
        toast({
          title: "¡Foto cargada!",
          description: "Tu foto está lista para usar.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureClick = (action: string) => {
    setCurrentAction(action);
    setShowModal(true);
    setGeneratedImage(null);
  };

  const handleGenerate = async () => {
    if (!currentAction) return;
    
    const feature = aiFeatures.find((f) => f.action === currentAction);
    
    // Validation
    if (feature?.requiresPhoto && !userPhoto) {
      toast({
        title: "Foto requerida",
        description: "Por favor, sube una foto para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFeature(currentAction);
    setIsGenerating(true);
    setShowModal(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { 
          type: currentAction,
          userPhoto: userPhoto,
          userName: userName.trim() || undefined,
          birthDate: birthDate || undefined,
          recipientName: recipientName.trim() || undefined,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setGenerationCount((prev) => prev + 1);

        toast({
          title: "¡Creación generada con IA!",
          description: feature?.result || "Tu contenido está listo.",
        });
      } else {
        throw new Error("No se pudo generar la imagen");
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast({
        title: "Error al generar",
        description: err instanceof Error ? err.message : "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAction = (action: typeof actions[0]) => {
    if (action.label === "Descargar" && generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `stranger-things-${selectedFeature}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Descarga iniciada", description: action.message });
    } else if (action.label === "Imprimir" && generatedImage) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html><head><title>Imprimir - Stranger Things</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
            <img src="${generatedImage}" style="max-width:100%;max-height:100vh;" onload="window.print();window.close();" />
          </body></html>
        `);
      }
    } else if (action.label === "Compartir" && generatedImage) {
      if (navigator.share) {
        navigator.share({
          title: "Mi creación de Stranger Things",
          text: "Mira lo que he creado con IA",
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Enlace copiado", description: action.message });
      }
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setSelectedFeature(null);
    setUserPhoto(null);
    setUserName("");
    setRecipientName("");
    setBirthDate("");
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentAction(null);
  };

  const currentFeature = aiFeatures.find((f) => f.action === currentAction);

  return (
    <section id="ia" className="relative py-20 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--neon-cyan)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--neon-cyan)) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-neon-magenta animate-pulse" />
            <span className="font-display text-neon-magenta tracking-[0.3em] text-sm">
              INTELIGENCIA ARTIFICIAL
            </span>
          </div>
          <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            CREA CON <span className="gradient-text">IA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sube tu foto y crea contenido único de Stranger Things. ¡Personaliza con tu nombre y fecha!
          </p>
          {generationCount > 0 && (
            <p className="text-sm text-neon-cyan mt-2">{generationCount} creaciones generadas en esta sesión</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-6">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              const isSelected = selectedFeature === feature.action;
              return (
                <div
                  key={feature.title}
                  onClick={() => !isGenerating && handleFeatureClick(feature.action)}
                  className={`group flex gap-4 p-4 rounded-xl hover:bg-card/50 transition-colors cursor-pointer ${isSelected ? "bg-card/50 border border-neon-magenta/30" : ""} ${isGenerating ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-magenta/20 to-neon-cyan/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-neon-magenta" />
                  </div>
                  <div>
                    <h3 className="font-title text-xl text-foreground mb-1 group-hover:text-neon-magenta transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <div className="flex gap-2 mt-2">
                      {feature.requiresPhoto && (
                        <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded">Requiere foto</span>
                      )}
                      {feature.requiresName && (
                        <span className="text-xs bg-neon-magenta/20 text-neon-magenta px-2 py-0.5 rounded">Personalizable</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 flex gap-3">
              <Button variant="neon-magenta" size="lg" onClick={() => handleFeatureClick("foto")} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir mi Foto
                  </>
                )}
              </Button>
              {generatedImage && (
                <Button variant="outline" size="lg" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nueva creación
                </Button>
              )}
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative">
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-[0_0_60px_hsl(var(--neon-magenta)/0.2)]">
              {/* Preview area */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 text-neon-magenta mx-auto mb-4 animate-spin" />
                    <p className="font-display text-sm text-muted-foreground tracking-wider">GENERANDO CON IA...</p>
                    <p className="text-xs text-muted-foreground mt-2">Esto puede tardar hasta 30 segundos</p>
                    <div className="mt-4 w-48 h-2 bg-muted/50 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-neon-magenta rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                  </div>
                ) : generatedImage ? (
                  <img src={generatedImage} alt="Creación generada por IA" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <Sparkles className="w-16 h-16 text-neon-magenta/50 mx-auto mb-4" />
                    <p className="font-display text-sm text-muted-foreground tracking-wider">TU CREACIÓN AQUÍ</p>
                    <p className="text-xs text-muted-foreground mt-2">Selecciona una opción y sube tu foto</p>
                  </div>
                )}
              </div>

              {/* Actions bar */}
              <div className="p-4 bg-card/80 backdrop-blur-sm border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {generatedImage ? "¡Listo! Descarga o comparte" : isGenerating ? "Procesando..." : "Esperando creación..."}
                  </span>
                  <div className="flex gap-2">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => handleAction(action)}
                          disabled={!generatedImage}
                          className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-neon-magenta/20 hover:text-neon-magenta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={action.label}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-neon-magenta/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-neon-cyan/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Modal for customization */}
      {showModal && currentFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-card rounded-2xl border border-border/50 max-w-md w-full p-6 shadow-[0_0_60px_hsl(var(--neon-magenta)/0.3)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-title text-2xl text-foreground">{currentFeature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{currentFeature.description}</p>
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Tu Foto {currentFeature.requiresPhoto ? "(requerida)" : "(opcional)"}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {userPhoto ? (
                  <div className="relative">
                    <img src={userPhoto} alt="Tu foto" className="w-full h-32 object-cover rounded-lg" />
                    <button 
                      onClick={() => setUserPhoto(null)}
                      className="absolute top-2 right-2 p-1 bg-destructive rounded-full"
                    >
                      <X className="w-4 h-4 text-destructive-foreground" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-neon-magenta/50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Haz clic o arrastra una imagen</span>
                    <span className="text-xs text-muted-foreground">Máximo 5MB</span>
                  </button>
                )}
              </div>

              {/* Name field for poster */}
              {(currentFeature.requiresName || currentAction === "poster") && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    <User className="w-3 h-3 inline mr-1" />
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="JUAN"
                    maxLength={15}
                    className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/50"
                  />
                </div>
              )}

              {/* Birthday card fields - compact layout */}
              {currentAction === "tarjeta" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      <User className="w-3 h-3 inline mr-1" />
                      Cumpleañero/a
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="MARÍA"
                      maxLength={12}
                      className="w-full px-2 py-1.5 text-sm bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Fecha
                    </label>
                    <input
                      type="text"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      placeholder="15 Marzo"
                      maxLength={15}
                      className="w-full px-2 py-1.5 text-sm bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-magenta/50"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="neon-magenta" className="flex-1" onClick={handleGenerate}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar con IA
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

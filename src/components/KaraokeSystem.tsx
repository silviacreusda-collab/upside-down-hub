import { useState, useRef, useEffect } from "react";
import { Mic, Upload, Play, ThumbsUp, Loader2, Music, Award, X, User, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface KaraokeSubmission {
  id: string;
  user_name: string;
  song_title: string;
  audio_url: string;
  votes: number;
  created_at: string;
}

const karaokeSongs = [
  { id: 1, title: "The Neverending Story", artist: "Limahl" },
  { id: 2, title: "Running Up That Hill", artist: "Kate Bush" },
  { id: 3, title: "Should I Stay or Should I Go", artist: "The Clash" },
  { id: 4, title: "Every Breath You Take", artist: "The Police" },
  { id: 5, title: "Hazy Shade of Winter", artist: "The Bangles" },
];

export const KaraokeSystem = () => {
  const [submissions, setSubmissions] = useState<KaraokeSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Form state
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch submissions
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("karaoke_submissions")
        .select("*")
        .order("votes", { ascending: false })
        .limit(20);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El audio debe ser menor de 10MB.",
          variant: "destructive",
        });
        return;
      }
      setAudioFile(file);
      toast({
        title: "¡Audio seleccionado!",
        description: file.name,
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedSong || !userName.trim() || !userEmail.trim() || !audioFile) {
      toast({
        title: "Completa todos los campos",
        description: "Selecciona canción, nombre, email y archivo de audio.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload audio to storage
      const fileName = `${Date.now()}-${audioFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { error: uploadError } = await supabase.storage
        .from("karaoke-recordings")
        .upload(fileName, audioFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("karaoke-recordings")
        .getPublicUrl(fileName);

      const song = karaokeSongs.find(s => s.id === selectedSong);

      // Save to database
      const { error: dbError } = await supabase.from("karaoke_submissions").insert({
        user_name: userName.trim(),
        user_email: userEmail.trim().toLowerCase(),
        song_id: selectedSong,
        song_title: song?.title || "Unknown",
        audio_url: urlData.publicUrl,
        votes: 0,
      });

      if (dbError) throw dbError;

      toast({
        title: "¡Grabación subida!",
        description: "Tu interpretación ya está disponible para votar.",
      });

      // Reset form
      setShowUploadModal(false);
      setSelectedSong(null);
      setUserName("");
      setUserEmail("");
      setAudioFile(null);
      
      // Refresh submissions
      fetchSubmissions();

    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Error al subir",
        description: "Hubo un problema. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleVote = async (id: string) => {
    if (votedIds.includes(id)) {
      toast({
        title: "Ya votaste",
        description: "Solo puedes votar una vez por grabación.",
      });
      return;
    }

    try {
      const submission = submissions.find(s => s.id === id);
      if (!submission) return;

      const { error } = await supabase
        .from("karaoke_submissions")
        .update({ votes: submission.votes + 1 })
        .eq("id", id);

      if (error) throw error;

      setVotedIds(prev => [...prev, id]);
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s)
          .sort((a, b) => b.votes - a.votes)
      );

      toast({
        title: "¡Voto registrado!",
        description: "Gracias por participar.",
      });

    } catch (err) {
      console.error("Vote error:", err);
      toast({
        title: "Error al votar",
        description: "Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handlePlay = (id: string, url: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingId(id);
      }
    }
  };

  return (
    <section id="musica" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-hawkins-night" />
      
      {/* Decoration */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-neon-yellow/20 opacity-20 animate-spin" style={{ animationDuration: '20s' }}>
        <div className="absolute inset-8 rounded-full border-2 border-neon-yellow/30" />
        <div className="absolute inset-16 rounded-full border border-neon-yellow/40" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic className="w-6 h-6 text-neon-yellow" />
            <span className="font-display text-neon-yellow tracking-[0.3em] text-sm">
              KARAOKE 80s
            </span>
          </div>
          <h2 className="font-title text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            CANTA Y <span className="text-neon-yellow">GANA</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sube tu grabación cantando temas de Stranger Things. 
            ¡La comunidad vota y el mejor cantante gana!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-neon-yellow/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-neon-yellow" />
              </div>
              <div>
                <h3 className="font-title text-xl text-foreground">Sube tu Karaoke</h3>
                <p className="text-sm text-muted-foreground">Graba y comparte tu talento</p>
              </div>
            </div>

            {/* Song selection */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-foreground">Canciones disponibles:</p>
              {karaokeSongs.map(song => (
                <div
                  key={song.id}
                  onClick={() => setSelectedSong(song.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSong === song.id 
                      ? "bg-neon-yellow/20 border border-neon-yellow/30" 
                      : "hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${
                    selectedSong === song.id ? "bg-neon-yellow/50" : "bg-muted/50"
                  }`}>
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`font-medium ${selectedSong === song.id ? "text-neon-yellow" : "text-foreground"}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="neon" className="w-full" onClick={() => setShowUploadModal(true)}>
              <Mic className="w-4 h-4 mr-2" />
              Subir mi grabación
            </Button>
          </div>

          {/* Submissions list */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-neon-magenta/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-neon-magenta" />
              </div>
              <div>
                <h3 className="font-title text-xl text-foreground">Ranking de Cantantes</h3>
                <p className="text-sm text-muted-foreground">¡Vota por tu favorito!</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-neon-yellow" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aún no hay grabaciones</p>
                <p className="text-sm text-muted-foreground">¡Sé el primero en subir!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {submissions.map((sub, idx) => (
                  <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-sm ${
                      idx === 0 ? "bg-neon-yellow/30 text-neon-yellow" :
                      idx === 1 ? "bg-neon-cyan/30 text-neon-cyan" :
                      idx === 2 ? "bg-neon-magenta/30 text-neon-magenta" :
                      "bg-muted/50 text-muted-foreground"
                    }`}>
                      {idx + 1}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{sub.user_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{sub.song_title}</p>
                    </div>

                    <button
                      onClick={() => handlePlay(sub.id, sub.audio_url)}
                      className={`p-2 rounded-lg transition-colors ${
                        playingId === sub.id 
                          ? "bg-neon-cyan/30 text-neon-cyan" 
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Play className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleVote(sub.id)}
                      disabled={votedIds.includes(sub.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                        votedIds.includes(sub.id)
                          ? "bg-neon-magenta/30 text-neon-magenta"
                          : "bg-muted/50 hover:bg-neon-magenta/20"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-display">{sub.votes}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden audio element */}
            <audio 
              ref={audioRef} 
              onEnded={() => setPlayingId(null)}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}>
          <div className="bg-card rounded-2xl border border-border/50 max-w-md w-full p-6 shadow-[0_0_60px_hsl(var(--neon-yellow)/0.3)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-title text-2xl text-foreground">Subir Grabación</h3>
                <p className="text-sm text-muted-foreground mt-1">Comparte tu interpretación</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Song info */}
              {selectedSong && (
                <div className="p-3 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg">
                  <p className="text-sm text-neon-yellow font-medium">
                    Canción: {karaokeSongs.find(s => s.id === selectedSong)?.title}
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Tu Nombre *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="Tu nombre artístico"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-yellow/50"
                  disabled={uploading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Tu Email *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-yellow/50"
                  disabled={uploading}
                />
              </div>

              {/* Audio file */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mic className="w-4 h-4 inline mr-2" />
                  Archivo de Audio *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                {audioFile ? (
                  <div className="p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-neon-cyan truncate">{audioFile.name}</span>
                    <button onClick={() => setAudioFile(null)} className="p-1 hover:bg-muted rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-neon-yellow/50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Seleccionar archivo (MP3, WAV...)</span>
                    <span className="text-xs text-muted-foreground">Máximo 10MB</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="neon" className="flex-1" onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Subir grabación
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowUploadModal(false)} disabled={uploading}>
                Cancelar
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Al subir, aceptas que otros usuarios puedan escuchar y votar tu grabación.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

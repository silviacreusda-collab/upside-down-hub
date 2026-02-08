import { useState, useRef, useCallback } from "react";

interface UseAudioRecorderOptions {
  onError?: (message: string) => void;
}

export interface UseAudioRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearRecording: () => void;
  recordingTime: number;
}

export function useAudioRecorder(
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn {
  const { onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  }, [audioUrl]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    // Clean up previous recording
    clearRecording();
    chunksRef.current = [];

    // Check if MediaRecorder is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onError?.("Tu navegador no soporta grabación de audio. Prueba Chrome o Firefox.");
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Determine best mimeType for desktop (Chrome/Firefox/Edge)
      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      console.log("Using mimeType:", mimeType);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        console.log("Recording complete. Blob size:", blob.size, "URL:", url);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        onError?.("Error durante la grabación. Intenta de nuevo.");
        stopRecording();
      };

      mediaRecorder.start(1000); // collect data every second
      setIsRecording(true);
      setRecordingTime(0);

      console.log("Recording started successfully");

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error("Microphone access error:", err);
      
      // Provide specific error messages
      const error = err as { name?: string };
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        onError?.("Permiso de micrófono denegado. Haz clic en el icono del candado en la barra de direcciones y permite el acceso al micrófono.");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        onError?.("No se encontró ningún micrófono. Conecta uno e intenta de nuevo.");
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        onError?.("El micrófono está siendo usado por otra aplicación. Ciérrala e intenta de nuevo.");
      } else {
        onError?.("No se pudo acceder al micrófono. Asegúrate de dar permiso al navegador.");
      }
    }
  }, [clearRecording, onError, stopRecording]);

  return {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    clearRecording,
    recordingTime,
  };
}

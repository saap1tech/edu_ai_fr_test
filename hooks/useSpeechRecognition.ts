import { useState, useCallback, useEffect } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface UseSpeechRecognitionProps {
  language?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

export function useSpeechRecognition({
  language = 'fr-FR',
  continuous = false,
  onResult,
  onError,
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const currentTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(currentTranscript);
          onResult?.(currentTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          const errorMessage = event.error;
          setError(errorMessage);
          onError?.(errorMessage);
        };

        setRecognition(recognition);
      } else {
        setError('Speech recognition not supported in this browser');
        onError?.('Speech recognition not supported in this browser');
      }
    }
  }, [continuous, language, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        setError(null);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Error starting speech recognition');
        onError?.('Error starting speech recognition');
      }
    }
  }, [recognition, onError]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
}
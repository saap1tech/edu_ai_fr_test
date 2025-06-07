import { useState, useCallback, useEffect } from 'react';

interface UseTextToSpeechProps {
  language?: string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  error: string | null;
}

export function useTextToSpeech({
  language = 'fr-FR',
  rate = 1,
  pitch = 1,
  onStart,
  onEnd,
  onError,
}: UseTextToSpeechProps = {}): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setError('Text-to-speech not supported in this browser');
      onError?.('Text-to-speech not supported in this browser');
    }
  }, [onError]);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        onStart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        onEnd?.();
      };

      utterance.onerror = (event) => {
        const errorMessage = event.error;
        setError(errorMessage);
        setIsSpeaking(false);
        setIsPaused(false);
        onError?.(errorMessage);
      };

      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error starting text-to-speech:', error);
      setError('Error starting text-to-speech');
      onError?.('Error starting text-to-speech');
    }
  }, [language, rate, pitch, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    error,
  };
}
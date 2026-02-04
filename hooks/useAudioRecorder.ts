import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isListening: boolean;
  transcript: string;
  startRecording: () => void;
  stopRecording: () => void;
  reset: () => void;
  hasAudioSupport: boolean;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const hasAudioSupport = useMemo(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionConstructor = (window as Window).SpeechRecognition || (window as Window).webkitSpeechRecognition;
      return !!SpeechRecognitionConstructor;
    }
    return false;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && hasAudioSupport) {
      const SpeechRecognitionConstructor = (window as Window).SpeechRecognition || (window as Window).webkitSpeechRecognition;
      
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ru-RU';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }

        setTranscript(prev => {
          if (finalTranscript) {
            return prev + finalTranscript;
          }
          return prev + interimTranscript;
        });
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start();
        } else {
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isRecording, hasAudioSupport]);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setTranscript('');
    setIsRecording(true);
    setIsListening(true);
    recognitionRef.current.start();
  }, []);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setIsRecording(false);
    setIsListening(false);
    recognitionRef.current.stop();
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setIsRecording(false);
    setIsListening(false);
  }, []);

  return {
    isRecording,
    isListening,
    transcript,
    startRecording,
    stopRecording,
    reset,
    hasAudioSupport
  };
}

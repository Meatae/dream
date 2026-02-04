'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DreamFormProps {
  onSubmit: (content: string, date: Date) => Promise<void>;
  loading: boolean;
  selectedDate: Date | null;
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

export function DreamForm({ onSubmit, loading, selectedDate }: DreamFormProps) {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showDateInput, setShowDateInput] = useState(false);
  const [dreamDate, setDreamDate] = useState<Date>(selectedDate || new Date());
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Ваш браузер не поддерживает голосовой ввод');
      return;
    }

    const SpeechRecognitionConstructor = (window as Window).SpeechRecognition || (window as Window).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionConstructor();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'ru-RU';

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let currentFinal = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += transcriptText;
        } else {
          interimTranscript += transcriptText;
        }
      }
      
      if (currentFinal) {
        setContent(prev => prev + currentFinal);
      }
      
      setTranscript(interimTranscript);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      stopRecording();
    };

    recognitionRef.current.onend = () => {
      if (isRecording) {
        recognitionRef.current?.start();
      }
    };

    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setTranscript('');
  };

  const handleSubmit = async () => {
    if (!content.trim() && !transcript.trim()) return;
    
    await onSubmit(content || transcript, dreamDate);
    setContent('');
    setTranscript('');
  };

  return (
    <Card className="bg-white border-[#e8e4df] shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDateInput(!showDateInput)}
            className={`flex items-center gap-2 text-sm ${
              showDateInput 
                ? 'bg-[#2c2825] text-white border-[#2c2825]' 
                : 'bg-white border-[#d4cfc7] text-[#5c5855] hover:bg-[#e8e4df]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {format(dreamDate, 'd MMMM yyyy', { locale: ru })}
          </Button>
        </div>
        
        {showDateInput && (
          <Input
            type="date"
            value={format(dreamDate, 'yyyy-MM-dd')}
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : new Date();
              setDreamDate(date);
            }}
            className="bg-[#faf8f5] border-[#d4cfc7] focus:border-[#a8a3a0] text-[#2c2825]"
          />
        )}

        <Textarea
          placeholder="Опишите свой сон или используйте голосовой ввод..."
          value={content || transcript}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] resize-none bg-[#faf8f5] border-[#d4cfc7] focus:border-[#a8a3a0] text-[#2c2825] placeholder:text-[#a8a3a0]"
          disabled={loading}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={isRecording ? "default" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              className={`
                ${isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white border-[#d4cfc7] hover:bg-[#e8e4df] text-[#5c5855]'
                }
              `}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-[#5c5855]">Запись...</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || (!content.trim() && !transcript.trim())}
            className="bg-[#2c2825] hover:bg-[#3d3a37] text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

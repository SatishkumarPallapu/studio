'use client';

import { useState, useRef, useEffect } from 'react';
import { chat, textToSpeech } from '@/ai/flows/chatbot-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Loader2, Send, Mic, User, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type AudioPlayback = {
  id: number;
  audio: HTMLAudioElement;
  isPlaying: boolean;
};

export default function ChatClient() {
  const { language, translations } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{ id: number, audio: HTMLAudioElement, isPlaying: boolean } | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: [{ text: msg.content }],
      }));

      const result = await chat({ prompt: input, language: language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English', history });
      const modelMessage: Message = { role: 'model', content: result.response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the chatbot.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ variant: 'destructive', title: 'Browser Not Supported', description: 'Speech recognition is not supported.' });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      toast({ title: 'Listening...', description: 'Please start speaking.' });
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setInput(prev => prev + finalTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (input) handleSendMessage();
    };

    recognitionRef.current.onerror = (event) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        toast({ variant: 'destructive', title: 'Voice Error', description: `Could not understand audio: ${event.error}` });
      }
      setIsRecording(false);
    };

    recognitionRef.current.start();
  };

 const handlePlayAudio = async (text: string, id: number) => {
    // If clicking the same message that is playing, pause it.
    if (currentAudio?.id === id && currentAudio.isPlaying) {
        currentAudio.audio.pause();
        return;
    }
    // If clicking the same message that is paused, play it.
    if (currentAudio?.id === id && !currentAudio.isPlaying) {
        currentAudio.audio.play();
        return;
    }

    // If there's an existing audio, pause it before starting new one.
    if (currentAudio) {
        currentAudio.audio.pause();
    }
    
    setIsLoading(true);
    try {
        const { audio: audioDataUri } = await textToSpeech({ text });
        const newAudio = new Audio(audioDataUri);
        
        newAudio.onplay = () => {
            setCurrentAudio({ id, audio: newAudio, isPlaying: true });
        };
        newAudio.onpause = () => {
            setCurrentAudio(prev => prev ? { ...prev, isPlaying: false } : null);
        };
        newAudio.onended = () => {
            setCurrentAudio(null);
        };
        
        newAudio.play();

    } catch (error) {
        console.error('TTS error:', error);
        toast({ variant: 'destructive', title: 'Audio Error', description: 'Could not generate audio.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <Card>
        <CardHeader>
          <CardTitle>Agripreneur AI Assistant</CardTitle>
          <CardDescription>Your strategic partner for profitable farming. Ask me anything.</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <Bot className="w-8 h-8 text-primary flex-shrink-0" />}
            <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'model' && (
                <Button variant="ghost" size="icon" className="mt-2 h-7 w-7" onClick={() => handlePlayAudio(msg.content, index)}>
                  {currentAudio?.id === index && currentAudio.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="sr-only">Play audio</span>
                </Button>
              )}
            </div>
            {msg.role === 'user' && <User className="w-8 h-8 flex-shrink-0" />}
          </div>
        ))}
         {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex items-start gap-3">
                <Bot className="w-8 h-8 text-primary flex-shrink-0 animate-pulse" />
                <div className="p-3 rounded-lg bg-muted">
                    <Loader2 className="w-5 h-5 animate-spin" />
                </div>
            </div>
        )}
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or use the mic to ask your AI assistant..."
            disabled={isLoading}
          />
          <Button type="button" size="icon" variant="outline" onClick={handleVoiceInput} disabled={isLoading}>
            <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
          </Button>
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

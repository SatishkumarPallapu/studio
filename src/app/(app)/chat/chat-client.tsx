
'use client';

import { useState, useRef, useEffect } from 'react';
import { chat, textToSpeech } from '@/ai/flows/chatbot-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Loader2, Send, Mic, User, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

type Message = {
  role: 'user' | 'model';
  content: string;
};

// Custom Icon for WhatsApp
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.165-.917-.165-.522-.025-.795-.025a1.29 1.29 0 0 0-.946.445c-.273.297-1.04 1.016-1.04 2.479s1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
  </svg>
);


export default function ChatClient() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
        role: 'model',
        content: "Hello! I'm your AI Rythu Mitra. Based on the current weather forecast, light rain is expected in 2 days. It would be wise to hold off on watering your Tomato crop. How else can I help you today?"
    }
  ]);
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
    if (currentAudio?.id === id && currentAudio.isPlaying) {
        currentAudio.audio.pause();
        return;
    }
    if (currentAudio?.id === id && !currentAudio.isPlaying) {
        currentAudio.audio.play();
        return;
    }

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

  const handleShareOnWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handlePlayAudio(msg.content, index)}>
                    {currentAudio?.id === index && currentAudio.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span className="sr-only">Play audio</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleShareOnWhatsApp(msg.content)}>
                    <WhatsAppIcon />
                    <span className="sr-only">Share on WhatsApp</span>
                  </Button>
                </div>
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

    
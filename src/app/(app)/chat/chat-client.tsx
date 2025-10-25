
'use client';

import { useState, useRef, useEffect } from 'react';
import { chat, textToSpeech } from '@/ai/flows/chatbot-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Bot, Loader2, Send, Mic, User, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

type Message = {
  role: 'user' | 'model';
  content: string;
};

interface ChatClientProps {
  farmerPhone?: string;
}

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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default function ChatClient({ farmerPhone }: ChatClientProps) {
  const { language, translations } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{
    id: number;
    audio: HTMLAudioElement;
    isPlaying: boolean;
  } | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const farmerPhoneRef = useRef(farmerPhone);

  const initialTip = translations.chat.initialTip;

  useEffect(() => {
    // Show AI tip in chat on initial load
    if (messages.length === 0) {
      setMessages([{ role: 'model', content: initialTip }]);
    }
    
    // Function to send the initial tip via WhatsApp
    const sendInitialWhatsAppTip = async () => {
        if (!farmerPhoneRef.current) return;
      try {
        await fetch('/api/send-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: `whatsapp:${farmerPhoneRef.current}`,
            message: initialTip,
          }),
        });
        console.log('✅ Initial WhatsApp tip sent!');
      } catch (err) {
        console.error('❌ Failed to send WhatsApp tip:', err);
        // We don't show a toast here to avoid bothering the user if the background task fails.
      }
    };

    // sendInitialWhatsAppTip(); // Uncomment to send tip on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTip]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: [{ text: msg.content }],
      }));

      const result = await chat({
        prompt: input,
        language:
          language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English',
        history,
      });
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

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Speech recognition is not supported.',
      });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang =
      language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      toast({ title: translations.chat.listening, description: translations.chat.listeningDescription });
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      setInput((prev) => prev + finalTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      if (input) handleSendMessage();
    };

    recognitionRef.current.onerror = (event) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        toast({
          variant: 'destructive',
          title: 'Voice Error',
          description: `Could not understand audio: ${event.error}`,
        });
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
        setCurrentAudio((prev) => (prev ? { ...prev, isPlaying: false } : null));
      };
      newAudio.onended = () => {
        setCurrentAudio(null);
      };

      newAudio.play();
    } catch (error) {
      console.error('TTS error:', error);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'Could not generate audio.',
      });
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
          <CardTitle>{translations.chat.title}</CardTitle>
          <CardDescription>
            {translations.chat.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : ''
            }`}
          >
            {msg.role === 'model' && (
              <Bot className="w-8 h-8 text-primary flex-shrink-0" />
            )}
            <div
              className={`p-3 rounded-lg max-w-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handlePlayAudio(msg.content, index)}
                  >
                    {currentAudio?.id === index && currentAudio.isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span className="sr-only">Play audio</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleShareOnWhatsApp(msg.content)}
                  >
                    <WhatsAppIcon />
                    <span className="sr-only">{translations.chat.share}</span>
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
            placeholder={translations.chat.inputPlaceholder}
            disabled={isLoading}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleVoiceInput}
            disabled={isLoading}
          >
            <Mic
              className={`h-5 w-5 ${
                isRecording ? 'text-red-500 animate-pulse' : ''
              }`}
            />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}


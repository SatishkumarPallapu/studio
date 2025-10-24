'use client';

import { useState, useRef, useEffect } from 'react';
import { chat, textToSpeech } from '@/ai/flows/chatbot-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Loader2, Send, Mic, Volume2, User, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isRecording, setIsRecording] = useState(false);
  const [audioPlayback, setAudioPlayback] = useState<AudioPlayback | null>(null);
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

      const result = await chat({ prompt: input, language, history });
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

  const handleVoiceInput = async () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
          toast({ variant: 'destructive', title: 'Browser Not Supported', description: 'Speech recognition is not supported in your browser.' });
          return;
      }
      
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = language === 'Telugu' ? 'te-IN' : language === 'Hindi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        toast({ title: 'Listening...', description: 'Please start speaking.' });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Automatically send the message after transcription
        setMessages((prevMessages) => {
            const newMessages = [...prevMessages, { role: 'user', content: transcript }];
            (async () => {
                setIsLoading(true);
                try {
                    const history = newMessages.map(msg => ({
                        role: msg.role,
                        content: [{ text: msg.content }],
                    }));

                    const result = await chat({ prompt: transcript, language, history });
                    const modelMessage: Message = { role: 'model', content: result.response };
                    setMessages((prev) => [...prev, modelMessage]);
                } catch (error) {
                    console.error('Chat error:', error);
                } finally {
                    setIsLoading(false);
                }
            })();
            return newMessages;
        });
        setInput(''); 
      };

      recognition.onerror = (event) => {
        // The 'aborted' error is common and happens when the user stops speaking.
        // We only want to show a toast for other, more critical errors.
        if (event.error !== 'aborted') {
          console.error('Speech recognition error:', event.error);
          toast({ variant: 'destructive', title: 'Voice Error', description: 'Could not understand audio.' });
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        recognitionRef.current = null;
      };

      recognition.start();

    } catch (error) {
      console.error('Media device error:', error);
      toast({ variant: 'destructive', title: 'Mic Error', description: 'Could not access the microphone or speech recognition is not supported.' });
    }
  };
  
  const handlePlayAudio = async (text: string, id: number) => {
    if (audioPlayback?.id === id && audioPlayback.isPlaying) {
      audioPlayback.audio.pause();
      setAudioPlayback(prev => prev ? { ...prev, isPlaying: false } : null);
      return;
    }
    if (audioPlayback?.id === id && !audioPlayback.isPlaying) {
        audioPlayback.audio.play();
        setAudioPlayback(prev => prev ? { ...prev, isPlaying: true } : null);
        return;
    }

    if (audioPlayback?.audio) {
      audioPlayback.audio.pause();
    }
    
    setIsLoading(true);
    try {
        const { audio: audioDataUri } = await textToSpeech({ text });
        const audio = new Audio(audioDataUri);
        
        audio.onplay = () => {
            setAudioPlayback({ id, audio, isPlaying: true });
        };
        audio.onpause = () => {
             setAudioPlayback(prev => prev ? { ...prev, isPlaying: false } : null);
        };
        audio.onended = () => {
            setAudioPlayback(null);
        };
        
        audio.play();

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
          <CardTitle>AI Rythu Mitra Chat</CardTitle>
          <CardDescription>Your personal agricultural assistant. Ask me anything in Telugu, Hindi, or English.</CardDescription>
        </CardHeader>
        <CardContent>
            <Select onValueChange={setLanguage} defaultValue={language}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                </SelectContent>
            </Select>
        </CardContent>
      </Card>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <Bot className="w-8 h-8 text-primary flex-shrink-0" />}
            <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p>{msg.content}</p>
              {msg.role === 'model' && (
                <Button variant="ghost" size="icon" className="mt-2 h-7 w-7" onClick={() => handlePlayAudio(msg.content, index)}>
                  {audioPlayback?.id === index && audioPlayback.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
            placeholder="Type your message or use the mic..."
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

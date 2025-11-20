'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { themeAssistantChat } from '@/app/ai/flows/theme-assistant-chat';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  content: string;
  imageUrls?: string[];
  imagePrompt?: string;
}

export default function ThemeAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I'm your AI Theme Assistant. What kind of baby shower are you dreaming of? Let's brainstorm some ideas together!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await themeAssistantChat({ prompt: input, history: chatHistory });

      const aiMessage: Message = { 
        role: 'model', 
        content: result.response,
        imageUrls: result.imageUrls,
        imagePrompt: result.imagePrompt,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI assistant:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sorry, I couldn't get a response. Please try again.",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="AI Theme Assistant" 
        description="Collaborate with our AI to brainstorm and create the perfect baby shower theme." 
      />
        
        <Card className="flex-1 flex flex-col shadow-lg border-2">
          <CardHeader className="border-b bg-card">
            <CardTitle className="font-headline text-lg flex items-center gap-2 text-foreground">
              <Icons.ThemeAssistant className="w-6 h-6 text-primary" />
              Chat with your Assistant
            </CardTitle>
            <p className="text-xs text-foreground/60 mt-2">
              💡 Tip: Ask for detailed theme ideas and I'll create visual images for you!
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 bg-muted/30">
            <ScrollArea className="h-full p-6">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'model' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-lg px-4 py-3 max-w-[80%] shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-primary/90 text-primary-foreground' 
                        : 'bg-card text-card-foreground border border-border'
                    }`}>
                      {message.role === 'user' ? (
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      {message.imageUrls && message.imageUrls.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <p className="text-xs font-medium text-foreground/70 italic flex items-center gap-1">
                            🎨 Here are {message.imageUrls.length} visual{message.imageUrls.length > 1 ? 's' : ''} of this theme idea:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {message.imageUrls.map((imageUrl, imgIndex) => (
                              <div key={imgIndex} className="relative group">
                                <img 
                                  src={imageUrl} 
                                  alt={`${message.imagePrompt || 'Theme visualization'} - Variation ${imgIndex + 1}`} 
                                  className="rounded-lg w-full h-auto border-2 border-primary/20 shadow-md hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                  Option {imgIndex + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-3 bg-card border border-border flex items-center shadow-sm">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-6 border-t bg-card">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me about your ideas..." 
                disabled={isLoading}
                className="flex-1 bg-background text-foreground"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="px-4">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
    </div>
  );
}


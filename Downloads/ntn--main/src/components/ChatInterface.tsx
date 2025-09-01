import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SpellChecker from "./SpellChecker";
import ServiceSelector from "./ServiceSelector";
import ContactDialog from "./ContactDialog";
import CodeInterface from "./CodeInterface";
import VercelDeploy from "./VercelDeploy";
import { aiService } from "@/services/aiService";
import { Send, Plus, Copy, Code, MessageCircle, Phone, Mail, Rocket } from "lucide-react";
import PandaLogo from "./PandaLogo";
import { useTheme } from "./ThemeProvider";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

type ServiceType = 'auto' | 'code' | 'creative' | 'knowledge' | 'general';

const ChatInterface = () => {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I am PandaNexus, built by Shakeel. I am your friendly AI assistant. Keep responses casual and helpful.",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('auto');
  const [showCodeInterface, setShowCodeInterface] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Show code interface
  if (showCodeInterface) {
    return <CodeInterface onBack={() => setShowCodeInterface(false)} />;
  }

  // Upload File
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileMessage: Message = {
        id: Date.now().toString(),
        content: e.target?.result as string,
        role: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    };
    reader.readAsText(file);
  };

  // Spell Check
  const handleSpellCheck = async () => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    try {
      const response = await aiService.sendMessage([{ role: 'user', content: inputValue }]);
      setInputValue(response.content); // only corrects input, no AI reply added
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(
        [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
      );
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Technical difficulties. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast("Message copied!", {
        description: "Content copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast("Copy failed", {
        description: "Please try again",
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Card className="border-0 border-b border-glass-border bg-gradient-glass backdrop-blur-xl">
        <div className="flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <PandaLogo className="w-6 h-6 md:w-8 md:h-8" />
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-text bg-clip-text text-transparent">
                PandaNexus
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">AI Hub • Lightning Fast</p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Code Interface Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCodeInterface(true)}
              className="h-8 px-2 md:px-3 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300"
            >
              <Code className="w-4 h-4 mr-1" />
              <span className="hidden md:inline">Code</span>
            </Button>
            
            {/* Deploy Button */}
            <VercelDeploy>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 md:px-3 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300"
              >
                <Rocket className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Deploy</span>
              </Button>
            </VercelDeploy>
            
            {/* Contact Button */}
            <ContactDialog>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 md:px-3 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Contact</span>
              </Button>
            </ContactDialog>
            
            <ServiceSelector
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 px-0"
            >
              {theme === 'dark' ? "☀️" : "🌙"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="relative group">
            <ChatMessage message={message} />
            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyMessage(message.content)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 bg-gradient-glass border border-glass-border hover:shadow-glow"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <Card className="border-0 border-t border-glass-border bg-gradient-glass backdrop-blur-xl m-2 md:m-4 md:mt-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 md:p-4">
          {/* Upload Button (+) */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 h-9 w-9 md:h-10 md:w-10 font-bold text-xl"
          >
            +
          </Button>

          {/* Input */}
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-input/50 border-glass-border backdrop-blur-sm focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />

          {/* Spell Check Button (Magic Star) */}
          <Button
            type="button"
            onClick={handleSpellCheck}
            variant="outline"
            size="icon"
            className="shrink-0 h-9 md:h-10 w-9 md:w-10"
          >
            ⭐
          </Button>

          {/* Send Button */}
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ChatInterface;

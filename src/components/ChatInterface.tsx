import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ServiceSelector from "./ServiceSelector";
import ContactDialog from "./ContactDialog";
import CodeInterface from "./CodeInterface";
import VercelDeploy from "./VercelDeploy";
import { aiService } from "@/services/aiService";
import { Send, Plus, Copy, Code, MessageCircle, Sparkles, Image, FileText, Wand2 } from "lucide-react";
import PandaLogo from "./PandaLogo";
import { useTheme } from "./ThemeProvider";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageUrl?: string;
  model?: string;
}

type ServiceType = 'auto' | 'code' | 'creative' | 'knowledge' | 'general';

const ChatInterface = () => {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm PandaNexus, your advanced AI assistant created by Shakeel. I can help you with coding, creative tasks, answer questions, generate images, and much more. What would you like to explore today?",
      role: 'assistant',
      timestamp: new Date(),
      model: 'PandaNexus Core'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>('auto');
  const [showCodeInterface, setShowCodeInterface] = useState(false);
  const [isSpellChecking, setIsSpellChecking] = useState(false);

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

  // Enhanced file upload with image support
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const fileMessage: Message = {
          id: Date.now().toString(),
          content: "Please analyze this image",
          role: 'user',
          timestamp: new Date(),
          imageUrl
        };
        setMessages(prev => [...prev, fileMessage]);
        
        // Auto-send for image analysis
        handleAIResponse([...messages, fileMessage]);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle text files
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileMessage: Message = {
          id: Date.now().toString(),
          content: `File content:\n\n${content}`,
          role: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fileMessage]);
      };
      reader.readAsText(file);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Enhanced spell checking with AI
  const handleSpellCheck = async () => {
    if (!inputValue.trim() || isSpellChecking) return;
    
    setIsSpellChecking(true);
    try {
      const correctedText = await aiService.checkSpelling(inputValue);
      setInputValue(correctedText);
      
      toast("✨ Text corrected!", {
        description: "Grammar and spelling have been improved",
        duration: 2000,
      });
    } catch (error) {
      console.error('Spell check failed:', error);
      toast("Spell check unavailable", {
        description: "Please check your text manually",
        duration: 2000,
      });
    } finally {
      setIsSpellChecking(false);
    }
  };

  // AI Response handler
  const handleAIResponse = async (messageHistory: Message[]) => {
    setIsLoading(true);
    
    try {
      const aiMessages = messageHistory.map(m => ({
        role: m.role,
        content: m.content,
        image: m.imageUrl
      }));

      const response = await aiService.sendMessage(aiMessages, selectedService);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        model: response.model,
        imageUrl: response.imageUrl
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing some technical difficulties. Please try again or contact support if the issue persists.",
        role: 'assistant',
        timestamp: new Date(),
        model: 'Error Handler'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");

    await handleAIResponse(newMessages);
  };

  // Copy message functionality
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast("📋 Copied!", {
        description: "Message copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      console.error('Copy failed:', err);
      toast("Copy failed", {
        description: "Please try selecting and copying manually",
        duration: 2000,
      });
    }
  };

  // Quick action buttons
  const quickActions = [
    { text: "Help me code", icon: Code },
    { text: "Generate an image", icon: Image },
    { text: "Write something creative", icon: Sparkles },
    { text: "Explain a concept", icon: FileText }
  ];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Enhanced Header */}
      <Card className="border-0 border-b border-glass-border bg-gradient-glass backdrop-blur-xl shadow-glass">
        <div className="flex items-center justify-between p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <PandaLogo className="w-7 h-7 md:w-9 md:h-9" animate />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse shadow-glow"></div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold bg-gradient-text bg-clip-text text-transparent">
                PandaNexus
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                AI Hub • {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)} Mode
              </p>
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
              <Code className="w-4 h-4 mr-0 md:mr-1" />
              <span className="hidden md:inline">Code</span>
            </Button>
            
            {/* Deploy Button */}
            <VercelDeploy>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 md:px-3 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300"
              >
                <svg className="w-4 h-4 mr-0 md:mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
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
                <MessageCircle className="w-4 h-4 mr-0 md:mr-1" />
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
              className="h-8 w-8 px-0 hover:bg-accent/20"
            >
              {theme === 'dark' ? "☀️" : "🌙"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4">
        {messages.length === 1 && (
          <div className="text-center py-8 md:py-12">
            <div className="space-y-6">
              <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24">
                <PandaLogo className="w-full h-full" animate />
                <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-xl rounded-full animate-glow-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
                  What can I help you with?
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => setInputValue(action.text)}
                      className="h-auto p-3 md:p-4 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300 flex flex-col gap-2"
                    >
                      <action.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      <span className="text-xs md:text-sm font-medium">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="relative group">
            <ChatMessage message={message} />
            {/* Enhanced Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyMessage(message.content)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-7 w-7 p-0 bg-gradient-glass border border-glass-border hover:shadow-glow backdrop-blur-sm"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        ))}
        
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <Card className="border-0 border-t border-glass-border bg-gradient-glass backdrop-blur-xl m-2 md:m-4 md:mt-0 shadow-glass">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 md:p-4">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,.txt,.md,.js,.py,.html,.css"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 h-9 w-9 md:h-10 md:w-10 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300"
            title="Upload file or image"
          >
            <Plus className="w-4 h-4" />
          </Button>

          {/* Main Input */}
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={`Ask PandaNexus anything... (${selectedService} mode)`}
              className="bg-input/50 border-glass-border backdrop-blur-sm focus:ring-2 focus:ring-primary/20 text-sm md:text-base pr-12"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            />
            
            {/* Character count */}
            <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
              {inputValue.length}/500
            </div>
          </div>

          {/* Enhanced Spell Check Button */}
          <Button
            type="button"
            onClick={handleSpellCheck}
            variant="outline"
            size="icon"
            disabled={isSpellChecking || !inputValue.trim()}
            className="shrink-0 h-9 md:h-10 w-9 md:w-10 bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300"
            title="AI Spell & Grammar Check"
          >
            {isSpellChecking ? (
              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-primary" />
            )}
          </Button>

          {/* Enhanced Send Button */}
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 shrink-0 h-9 md:h-10 w-9 md:w-10 flex items-center justify-center"
            title="Send message"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        {/* Status Bar */}
        <div className="px-3 md:px-4 pb-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>PandaNexus AI • Ready</span>
            {messages.length > 1 && (
              <Badge variant="outline" className="text-xs bg-gradient-glass border-glass-border">
                {messages.length - 1} messages
              </Badge>
            )}
          </div>
          <div className="hidden md:block">
            Press Enter to send • Ctrl+Enter for new line
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
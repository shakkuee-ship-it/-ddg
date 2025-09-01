import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { aiService } from "@/services/aiService";
import { Send, Code, Terminal, FileCode, Zap, Copy, Download, Play } from "lucide-react";
import PandaLogo from "./PandaLogo";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  code?: string;
  language?: string;
}

interface CodeInterfaceProps {
  onBack: () => void;
}

const CodeInterface = ({ onBack }: CodeInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🚀 Welcome to PandaNexus Code Studio! I'm your AI coding assistant. I can help you write, debug, optimize, and deploy code. What would you like to build today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const codeOutputRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "typescript", label: "TypeScript", icon: "🔷" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "react", label: "React", icon: "⚛️" },
    { value: "nodejs", label: "Node.js", icon: "🟢" },
    { value: "html", label: "HTML", icon: "🌐" },
    { value: "css", label: "CSS", icon: "🎨" },
    { value: "sql", label: "SQL", icon: "🗄️" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast("Code copied to clipboard!", {
        description: "Ready to paste in your editor",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast("Code downloaded!", {
      description: `Saved as ${filename}`,
      duration: 2000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const codePrompt = `[CODING REQUEST - ${selectedLanguage.toUpperCase()}]\n\n${inputValue}\n\nPlease provide clean, well-commented code with explanations. Include best practices and optimization tips.`;

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
      const response = await aiService.sendMessage([
        { role: 'system', content: 'You are PandaNexus Code Assistant. Provide clean, efficient code with explanations.' },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: codePrompt }
      ]);

      // Extract code blocks from response
      const codeMatch = response.content.match(/```(\w+)?\n([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[2] : '';
      const language = codeMatch ? codeMatch[1] || selectedLanguage : selectedLanguage;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        code: code,
        language: language
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "⚠️ Code generation failed. Please try again with a more specific request.",
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Enhanced Header */}
      <Card className="border-0 border-b border-glass-border bg-gradient-glass backdrop-blur-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-accent/20"
            >
              ← Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <PandaLogo className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-text bg-clip-text text-transparent flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Code Studio
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Development</p>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gradient-glass border-glass-border">
              <Terminal className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-gradient-glass border border-glass-border rounded-md px-3 py-1 text-sm backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.icon} {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Code Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <ChatMessage message={message} />
            
            {/* Enhanced Code Block */}
            {message.code && (
              <Card className="mt-3 bg-gradient-glass border-glass-border shadow-glass overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-glass-border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{message.language}</span>
                    <Badge variant="secondary" className="text-xs">
                      {message.code.split('\n').length} lines
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCode(message.code!)}
                      className="h-8 px-2"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadCode(message.code!, `code.${message.language}`)}
                      className="h-8 px-2"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <pre className="p-4 overflow-x-auto text-sm bg-muted/10">
                    <code className="text-foreground">{message.code}</code>
                  </pre>
                  <div className="absolute top-2 right-2 opacity-50">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Card>
            )}
          </div>
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <Card className="border-0 border-t border-glass-border bg-gradient-glass backdrop-blur-xl m-4 mt-0">
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {[
              "Create a React component",
              "Debug this code",
              "Optimize performance",
              "Add error handling",
              "Write unit tests",
              "Deploy to Vercel"
            ].map(action => (
              <Button
                key={action}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInputValue(action)}
                className="text-xs bg-gradient-glass border-glass-border hover:shadow-glow"
              >
                {action}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Textarea
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={`Describe your ${selectedLanguage} coding task...`}
                className="min-h-[80px] bg-input/50 border-glass-border backdrop-blur-sm focus:ring-2 focus:ring-primary/20 resize-none"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Press Ctrl+Enter to send • Use natural language to describe what you want to build
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 px-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CodeInterface;
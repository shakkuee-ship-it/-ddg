import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import PandaLogo from "./PandaLogo";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    model?: string;
    imageUrl?: string;
  };
  isTyping?: boolean;
}

const ChatMessage = ({ message, isTyping = false }: ChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    if (message.role === 'assistant' && !isTyping) {
      setDisplayedContent("");
      let index = 0;
      const text = message.content;
      
      const typeWriter = () => {
        if (index < text.length) {
          setDisplayedContent(text.slice(0, index + 1));
          index++;
          setTimeout(typeWriter, 20); // Smooth typing speed
        } else {
          setShowCursor(false);
        }
      };
      
      setTimeout(typeWriter, 200);
    } else {
      setDisplayedContent(message.content);
      setShowCursor(false);
    }
  }, [message.content, message.role, isTyping]);

  const isCodeBlock = message.content.includes('```');
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2 md:gap-4 p-3 md:p-4 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow relative">
            <PandaLogo className="w-4 h-4 md:w-6 md:h-6" animate={isTyping} />
            {message.model && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-background"></div>
            )}
          </div>
        </div>
      )}
      
      <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div className={`
          backdrop-blur-xl border border-glass-border shadow-glass
          ${isUser 
            ? 'bg-gradient-primary text-primary-foreground ml-auto rounded-l-2xl rounded-tr-2xl' 
            : 'bg-gradient-glass text-foreground rounded-r-2xl rounded-tl-2xl'
          }
          p-3 md:p-4 transition-all duration-300 hover:shadow-glow
        `}>
          {/* Image Display */}
          {message.imageUrl && (
            <div className="mb-3 md:mb-4 group">
              <img 
                src={message.imageUrl} 
                alt={isUser ? "Uploaded image" : "Generated image"}
                className="max-w-full rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer shadow-lg" 
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Message Content */}
          {isCodeBlock ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs bg-muted/20 border-glass-border">
                  <Code className="w-3 h-3 mr-1" />
                  Code
                </Badge>
              </div>
              <pre className={`
                font-mono text-xs md:text-sm overflow-x-auto p-3 md:p-4 rounded-lg border
                ${isUser ? 'bg-black/20 border-white/20' : 'bg-muted/20 border-border/20'}
              `}>
                <code className="text-foreground">{displayedContent}</code>
              </pre>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                {displayedContent
                  .replace(/\*\*(.*?)\*\*/g, '$1')
                  .replace(/\*(.*?)\*/g, '$1')
                  .replace(/###\s*/g, '')
                  .replace(/##\s*/g, '')
                  .replace(/#\s*/g, '')
                  .split('\n').map((line, index) => {
                    if (!line.trim()) return <br key={index} />;
                    
                    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                      return (
                        <div key={index} className="flex items-start gap-2 ml-2 mb-1">
                          <span className="text-primary mt-1 text-xs">•</span>
                          <span>{line.replace(/^[•\-]\s*/, '')}</span>
                        </div>
                      );
                    }
                    
                    return <div key={index} className="mb-1">{line}</div>;
                  })}
                {message.role === 'assistant' && showCursor && (
                  <span className="animate-pulse ml-1 text-primary">▋</span>
                )}
              </div>
            </div>
          )}
          
          {/* Message Footer */}
          <div className="flex items-center justify-between mt-2 md:mt-3 pt-2 md:pt-3 border-t border-glass-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.model && (
                <Badge variant="outline" className="text-xs bg-muted/20 border-glass-border">
                  {message.model.split('/').pop()?.split(':')[0] || message.model}
                </Badge>
              )}
            </div>
            
            {!isUser && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs opacity-50">AI</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center border border-glass-border shadow-glass">
            <span className="text-xs md:text-sm font-medium">👤</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
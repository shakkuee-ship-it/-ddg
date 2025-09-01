import PandaLogo from "./PandaLogo";

const TypingIndicator = () => {
  return (
    <div className="flex gap-4 p-6 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-glow-pulse">
          <PandaLogo className="w-6 h-6" animate />
        </div>
      </div>
      
      <div className="max-w-[80%]">
        <div className="backdrop-blur-xl border border-glass-border shadow-glass bg-gradient-glass text-foreground rounded-r-2xl rounded-tl-2xl p-4 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">PandaNexus is thinking</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Routing to optimal AI model...
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
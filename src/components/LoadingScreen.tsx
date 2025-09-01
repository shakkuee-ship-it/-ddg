import { useEffect, useState } from "react";
import PandaLogo from "./PandaLogo";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, size: number}>>([]);

  const phases = [
    "🧠 Initializing Neural Networks...",
    "🤖 Loading AI Models...", 
    "☁️ Connecting to PandaNexus Cloud...",
    "⚡ Optimizing Performance...",
    "🎯 Calibrating Intelligence...",
    "🚀 Ready to Launch!"
  ];

  useEffect(() => {
    // Generate enhanced floating particles
    const newParticles = Array.from({length: 30}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * 3 + 1
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1.2;
        
        const phaseIndex = Math.floor((newProgress / 100) * phases.length);
        setCurrentPhase(Math.min(phaseIndex, phases.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center z-50 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute bg-primary/30 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Neural network grid */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
              <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="hsl(var(--primary))" opacity="0.3">
                  <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3s" repeatCount="indefinite"/>
                </circle>
                <path d="M0 50 L100 50 M50 0 L50 100" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neural-grid)" />
            
            {/* Animated connection lines */}
            <g className="animate-pulse">
              {Array.from({length: 8}).map((_, i) => (
                <line
                  key={i}
                  x1={Math.random() * 1000}
                  y1={Math.random() * 1000}
                  x2={Math.random() * 1000}
                  y2={Math.random() * 1000}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity="0.3"
                >
                  <animate 
                    attributeName="opacity" 
                    values="0.1;0.7;0.1" 
                    dur={`${2 + Math.random() * 2}s`} 
                    repeatCount="indefinite"
                    begin={`${Math.random() * 2}s`}
                  />
                </line>
              ))}
            </g>
          </svg>
        </div>
      </div>

      <div className="text-center space-y-8 md:space-y-12 z-10 max-w-2xl mx-auto px-4 md:px-8">
        {/* Enhanced Holographic Panda Logo */}
        <div className="relative">
          {/* Outer glow rings */}
          <div className="absolute -inset-20 md:-inset-24 bg-gradient-primary opacity-10 blur-3xl rounded-full animate-glow-pulse"></div>
          <div className="absolute -inset-12 md:-inset-16 border border-primary/20 rounded-full animate-spin" style={{animationDuration: '12s'}}></div>
          <div className="absolute -inset-8 md:-inset-12 border border-primary/30 rounded-full animate-spin" style={{animationDuration: '8s', animationDirection: 'reverse'}}></div>
          <div className="absolute -inset-4 md:-inset-6 border border-primary/40 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
          
          {/* Main logo container */}
          <div className="relative bg-gradient-glass backdrop-blur-xl border border-glass-border rounded-full p-6 md:p-8 shadow-glass">
            <PandaLogo className="w-20 h-20 md:w-28 md:h-28 animate-float relative z-10" animate />
            
            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin" style={{animationDuration: '10s'}}>
              <div className="absolute -top-2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 shadow-glow"></div>
              <div className="absolute top-1/2 -right-2 w-3 h-3 bg-accent rounded-full transform -translate-y-1/2 shadow-glow"></div>
              <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 shadow-glow"></div>
              <div className="absolute top-1/2 -left-2 w-3 h-3 bg-accent rounded-full transform -translate-y-1/2 shadow-glow"></div>
            </div>
            
            {/* Inner orbiting ring */}
            <div className="absolute inset-4 animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-secondary rounded-full transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-secondary rounded-full transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Brand Animation */}
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-text bg-clip-text text-transparent animate-fade-in">
            {['P','a','n','d','a','N','e','x','u','s'].map((letter, i) => (
              <span 
                key={i}
                className="inline-block animate-bounce" 
                style={{animationDelay: `${i * 100}ms`, animationDuration: '1s'}}
              >
                {letter}
              </span>
            ))}
          </h1>
          
          <div className="relative">
            <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in animation-delay-300">
              Where AI meets Excellence
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 md:w-48 h-0.5 bg-gradient-primary animate-pulse"></div>
          </div>
        </div>

        {/* Enhanced Progress System */}
        <div className="space-y-6 md:space-y-8">
          {/* Holographic Progress Bar */}
          <div className="relative">
            <div className="h-4 md:h-5 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm border border-glass-border shadow-glass">
              <div className="relative h-full">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
                  <div className="absolute right-0 top-0 w-2 h-full bg-white/50 blur-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Progress percentage with enhanced glow */}
            <div className="absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <span className="text-3xl md:text-4xl font-bold text-primary drop-shadow-glow">
                  {Math.round(progress)}%
                </span>
                <div className="absolute inset-0 text-3xl md:text-4xl font-bold text-primary/20 blur-sm">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Phase Indicator */}
          <div className="space-y-4">
            <div className="relative">
              <p className="text-lg md:text-xl text-foreground font-medium">
                {phases[currentPhase]}
              </p>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-primary opacity-50 animate-pulse"></div>
            </div>
            
            {/* Enhanced Phase Dots */}
            <div className="flex justify-center gap-3">
              {phases.map((_, index) => (
                <div
                  key={index}
                  className={`relative transition-all duration-500 ${
                    index <= currentPhase 
                      ? 'w-3 h-3 bg-primary shadow-glow scale-125' 
                      : 'w-2 h-2 bg-muted/50'
                  } rounded-full`}
                >
                  {index <= currentPhase && (
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Feature Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-12">
          {[
            { icon: '🧠', label: 'Neural AI', desc: 'Advanced reasoning', delay: '0ms' },
            { icon: '💻', label: 'Code Gen', desc: 'Smart coding', delay: '200ms' },
            { icon: '🎨', label: 'Creative', desc: 'Art & writing', delay: '400ms' },
            { icon: '⚡', label: 'Lightning', desc: 'Ultra fast', delay: '600ms' }
          ].map((feature, index) => (
            <div 
              key={feature.label}
              className="bg-gradient-glass backdrop-blur-xl border border-glass-border rounded-xl p-3 md:p-4 shadow-glass animate-fade-in hover:shadow-glow transition-all duration-300"
              style={{ animationDelay: feature.delay }}
            >
              <div className="text-2xl md:text-3xl mb-2 animate-bounce" style={{animationDelay: feature.delay}}>
                {feature.icon}
              </div>
              <p className="text-sm font-medium mb-1">{feature.label}</p>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Loading Animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full animate-bounce shadow-glow"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <span className="text-sm md:text-base text-muted-foreground animate-pulse">
              Preparing your AI experience...
            </span>
          </div>
          
          {/* System status */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Enhanced Corner Decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 md:w-20 md:h-20 border-l-2 border-t-2 border-primary/30 animate-pulse"></div>
      <div className="absolute top-4 right-4 w-12 h-12 md:w-20 md:h-20 border-r-2 border-t-2 border-primary/30 animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 md:w-20 md:h-20 border-l-2 border-b-2 border-primary/30 animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 md:w-20 md:h-20 border-r-2 border-b-2 border-primary/30 animate-pulse"></div>
      
      {/* Mobile-specific enhancements */}
      <div className="md:hidden absolute top-1/2 left-4 right-4 transform -translate-y-1/2">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
import { useEffect, useState } from "react";
import PandaLogo from "./PandaLogo";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  const phases = [
    "Initializing Neural Networks...",
    "Loading AI Models...", 
    "Connecting to PandaNexus Cloud...",
    "Optimizing Performance...",
    "Ready to Launch!"
  ];

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({length: 20}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1.5;
        
        // Update phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * phases.length);
        setCurrentPhase(Math.min(phaseIndex, phases.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Animated connection lines */}
          <g className="animate-pulse">
            <line x1="100" y1="200" x2="300" y2="400" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
            </line>
            <line x1="700" y1="300" x2="500" y2="600" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.5">
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite"/>
            </line>
            <line x1="200" y1="700" x2="800" y2="200" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.3">
              <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3s" repeatCount="indefinite"/>
            </line>
          </g>
        </svg>
      </div>

      <div className="text-center space-y-12 z-10 max-w-2xl mx-auto px-8">
        {/* Holographic Panda Logo */}
        <div className="relative">
          <div className="absolute -inset-16 bg-gradient-primary opacity-20 blur-3xl rounded-full animate-glow-pulse"></div>
          <div className="absolute -inset-8 border border-primary/20 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
          <div className="absolute -inset-4 border border-primary/30 rounded-full animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
          
          <div className="relative bg-gradient-glass backdrop-blur-xl border border-glass-border rounded-full p-8 shadow-glass">
            <PandaLogo className="w-24 h-24 animate-float relative z-10" animate />
            
            {/* Orbiting elements */}
            <div className="absolute inset-0 animate-spin" style={{animationDuration: '6s'}}>
              <div className="absolute -top-2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 -right-2 w-2 h-2 bg-accent rounded-full transform -translate-y-1/2"></div>
              <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 -left-2 w-2 h-2 bg-accent rounded-full transform -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* Dynamic Brand Name */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold bg-gradient-text bg-clip-text text-transparent animate-fade-in">
            <span className="inline-block animate-bounce" style={{animationDelay: '0ms'}}>P</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '100ms'}}>a</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '200ms'}}>n</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '300ms'}}>d</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '400ms'}}>a</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '500ms'}}>N</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '600ms'}}>e</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '700ms'}}>x</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '800ms'}}>u</span>
            <span className="inline-block animate-bounce" style={{animationDelay: '900ms'}}>s</span>
          </h1>
          
          <div className="relative">
            <p className="text-2xl text-muted-foreground animate-fade-in animation-delay-300">
              Where AI meets Excellence
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-primary animate-pulse"></div>
          </div>
        </div>

        {/* Advanced Progress System */}
        <div className="space-y-6">
          {/* Holographic Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm border border-glass-border">
              <div className="relative h-full">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
                </div>
              </div>
            </div>
            
            {/* Progress percentage with glow */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <span className="text-2xl font-bold text-primary drop-shadow-glow">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Phase indicator */}
          <div className="space-y-3">
            <p className="text-lg text-foreground font-medium">
              {phases[currentPhase]}
            </p>
            
            {/* Phase dots */}
            <div className="flex justify-center gap-2">
              {phases.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentPhase 
                      ? 'bg-primary shadow-glow scale-125' 
                      : 'bg-muted/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: '🧠', label: 'Neural AI', delay: '0ms' },
            { icon: '💻', label: 'Code Gen', delay: '200ms' },
            { icon: '🎨', label: 'Creative', delay: '400ms' },
            { icon: '⚡', label: 'Lightning', delay: '600ms' }
          ].map((feature, index) => (
            <div 
              key={feature.label}
              className="bg-gradient-glass backdrop-blur-xl border border-glass-border rounded-xl p-4 shadow-glass animate-fade-in hover:shadow-glow transition-all duration-300"
              style={{ animationDelay: feature.delay }}
            >
              <div className="text-3xl mb-2 animate-bounce" style={{animationDelay: feature.delay}}>
                {feature.icon}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {feature.label}
              </p>
            </div>
          ))}
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-3 h-3 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <span className="ml-4 text-muted-foreground animate-pulse">
            Preparing your AI experience...
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/30 animate-pulse"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-primary/30 animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-primary/30 animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary/30 animate-pulse"></div>
    </div>
  );
};

export default LoadingScreen;
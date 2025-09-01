import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Brain, Code, Palette, BookOpen, MessageSquare } from "lucide-react";

type ServiceType = 'auto' | 'code' | 'creative' | 'knowledge' | 'general';

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
  className?: string;
}

const serviceOptions = [
  { 
    value: 'auto', 
    label: 'Auto', 
    icon: Brain,
    description: 'Smart routing',
    color: 'text-primary'
  },
  { 
    value: 'code', 
    label: 'Code', 
    icon: Code,
    description: 'Programming help',
    color: 'text-blue-400'
  },
  { 
    value: 'creative', 
    label: 'Creative', 
    icon: Palette,
    description: 'Art & writing',
    color: 'text-purple-400'
  },
  { 
    value: 'knowledge', 
    label: 'Knowledge', 
    icon: BookOpen,
    description: 'Q&A expert',
    color: 'text-green-400'
  },
  { 
    value: 'general', 
    label: 'Chat', 
    icon: MessageSquare,
    description: 'General chat',
    color: 'text-orange-400'
  },
] as const;

export function ServiceSelector({ selectedService, onServiceChange, className }: ServiceSelectorProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-1 md:gap-2", className)}>
      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <select
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value as ServiceType)}
          className="w-full bg-gradient-glass border border-glass-border rounded-lg px-3 py-2 text-sm backdrop-blur-sm focus:ring-2 focus:ring-primary/20"
        >
          {serviceOptions.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label} - {service.description}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex gap-1 p-1 bg-gradient-glass rounded-lg border border-glass-border backdrop-blur-xl">
        {serviceOptions.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.value;
          
          return (
            <Button
              key={service.value}
              variant={isSelected ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                "flex items-center gap-1.5 h-8 px-3 text-xs transition-all duration-300",
                isSelected 
                  ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                  : "hover:bg-accent/20 hover:shadow-glow"
              )}
              onClick={() => onServiceChange(service.value as ServiceType)}
              title={service.description}
            >
              <Icon className={cn("w-3 h-3", isSelected ? "text-primary-foreground" : service.color)} />
              <span className="font-medium">{service.label}</span>
              {isSelected && (
                <div className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse"></div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Service Status Badge */}
      <div className="hidden lg:flex items-center">
        <Badge 
          variant="outline" 
          className="bg-gradient-glass border-glass-border text-xs"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-1"></div>
          {serviceOptions.find(s => s.value === selectedService)?.description}
        </Badge>
      </div>
    </div>
  );
}

export default ServiceSelector;
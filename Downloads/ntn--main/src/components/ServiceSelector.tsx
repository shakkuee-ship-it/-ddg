import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ServiceType = 'auto' | 'code' | 'creative' | 'knowledge' | 'general';

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onServiceChange: (service: ServiceType) => void;
  className?: string;
}

const serviceOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'code', label: 'Code' },
  { value: 'creative', label: 'Creative' },
  { value: 'knowledge', label: 'Knowledge' },
  { value: 'general', label: 'General' },
] as const;

export function ServiceSelector({ selectedService, onServiceChange, className }: ServiceSelectorProps) {
  return (
    <div className={cn("hidden md:flex flex-wrap gap-1 p-1 bg-gradient-glass rounded-lg border border-glass-border", className)}>
      {serviceOptions.map((service) => (
        <Button
          key={service.value}
          variant={selectedService === service.value ? 'default' : 'outline'}
          size="sm"
          className="flex-1 min-w-[60px] h-7 text-xs bg-gradient-glass border-glass-border hover:shadow-glow transition-all duration-300"
          onClick={() => onServiceChange(service.value as ServiceType)}
        >
          {service.label}
        </Button>
      ))}
    </div>
  );
}

export default ServiceSelector;

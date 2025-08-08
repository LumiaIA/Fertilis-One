import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const ModuleCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  isActive = false,
  onClick,
  className 
}: ModuleCardProps) => {
  return (
    <div 
      className={cn(
        "group relative bg-gradient-surface rounded-2xl p-6 shadow-card hover:shadow-elegant transition-smooth cursor-pointer border border-border/50",
        isActive && "ring-2 ring-primary shadow-glow",
        className
      )}
      onClick={onClick}
    >
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-0 group-hover:opacity-100 transition-smooth rounded-2xl" />
      
      <div className="relative z-10">
        {/* Icon and title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 bg-gradient-primary p-3 rounded-xl shadow-glow group-hover:scale-105 transition-smooth">
            <Icon className="w-6 h-6 text-sidebar-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-smooth">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-yellow rounded-full flex-shrink-0" />
              <span className="text-sm text-foreground/80">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-4 right-4 w-3 h-3 bg-accent-yellow rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
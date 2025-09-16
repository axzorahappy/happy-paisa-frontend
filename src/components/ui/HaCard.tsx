import React from 'react';
import { cn } from '../../lib/utils';

interface HaCardProps {
  children: React.ReactNode;
  header?: string;
  raised?: boolean;
  className?: string;
  onClick?: () => void;
}

export function HaCard({ 
  children, 
  header, 
  raised = false, 
  className,
  onClick 
}: HaCardProps) {
  return (
    <div 
      className={cn(
        // Base card styles inspired by Home Assistant
        "bg-white/5 backdrop-blur-sm",
        "border border-white/10 rounded-xl",
        "text-white transition-all duration-300 ease-out",
        "relative block overflow-hidden",
        
        // Raised variant with shadow
        raised && "border-none shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]",
        
        // Hover effects
        onClick && "cursor-pointer hover:bg-white/10 hover:border-white/20",
        
        className
      )}
      onClick={onClick}
    >
      {header && (
        <h1 className="text-xl font-normal leading-relaxed tracking-tight px-4 pt-3 pb-4 text-white/90">
          {header}
        </h1>
      )}
      <div className={cn("px-4", !header && "pt-4", "pb-4")}>
        {children}
      </div>
    </div>
  );
}

// Card content wrapper
export function HaCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {children}
    </div>
  );
}

// Card actions footer
export function HaCardActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "border-t border-white/10 px-4 py-3 flex items-center justify-between space-x-3",
      className
    )}>
      {children}
    </div>
  );
}
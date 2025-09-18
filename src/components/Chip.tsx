import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className }: ChipProps) {
  return (
    <div className={`bg-accent text-white text-xs font-semibold px-2.5 py-0.5 rounded-full ${className}`}>
      {children}
    </div>
  );
}
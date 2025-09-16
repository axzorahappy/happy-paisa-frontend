import React from 'react';
import { motion } from 'framer-motion';

interface HaProgressRingProps {
  value: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function HaProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = '#7c3aed', // brand purple
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  showValue = true,
  className = '',
  children
}: HaProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference.toFixed(3);
  const strokeDashoffset = (circumference - (value / 100) * circumference).toFixed(3);

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            delay: 0.2
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ? (
          children
        ) : showValue ? (
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(value)}%
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Stats card using progress ring
export function StatsCard({ 
  title, 
  value, 
  total, 
  subtitle, 
  color,
  icon: Icon 
}: {
  title: string;
  value: number;
  total: number;
  subtitle?: string;
  color?: string;
  icon?: any;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-white/70">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-2 bg-white/10 rounded-lg">
            <Icon className="w-6 h-6 text-white/80" />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-6">
        <HaProgressRing
          value={percentage}
          size={80}
          color={color}
          strokeWidth={6}
          showValue={false}
        >
          <div className="text-center">
            <div className="text-lg font-bold text-white">{value}</div>
            <div className="text-xs text-white/60">of {total}</div>
          </div>
        </HaProgressRing>
        
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/80">Progress</span>
            <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div 
              className="h-2 rounded-full"
              style={{ backgroundColor: color || '#7c3aed' }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
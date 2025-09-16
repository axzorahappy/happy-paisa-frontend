import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatCoins } from '../../lib/utils';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface StatsChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  animate?: boolean;
}

export function StatsChart({ 
  data, 
  title, 
  color = '#7c3aed',
  height = 200,
  showGrid = true,
  animate = true 
}: StatsChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return { points: [], maxValue: 0, minValue: 0 };

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = data.map((point, index) => ({
      ...point,
      x: (index / (data.length - 1)) * 100,
      y: ((maxValue - point.value) / range) * 100
    }));

    return { points, maxValue, minValue };
  }, [data]);

  const pathD = useMemo(() => {
    if (!chartData.points.length) return '';
    
    const path = chartData.points.reduce((acc, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${acc} ${command} ${point.x} ${point.y}`;
    }, '');
    
    return path.trim();
  }, [chartData.points]);

  const areaD = useMemo(() => {
    if (!pathD) return '';
    return `${pathD} L 100 100 L 0 100 Z`;
  }, [pathD]);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <div className="flex items-center space-x-4 mt-2">
          <div className="text-2xl font-bold text-white">
            {formatCoins(chartData.points[chartData.points.length - 1]?.value || 0)}
          </div>
          {chartData.points.length > 1 && (
            <div className="text-sm text-green-400">
              +{formatCoins(
                (chartData.points[chartData.points.length - 1]?.value || 0) - 
                (chartData.points[0]?.value || 0)
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="white"
                  strokeWidth="0.2"
                />
              ))}
              {[0, 25, 50, 75, 100].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="100"
                  stroke="white"
                  strokeWidth="0.2"
                />
              ))}
            </g>
          )}

          {/* Area fill */}
          {areaD && (
            <motion.path
              d={areaD}
              fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: animate ? 1 : 1, opacity: 0.3 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          )}

          {/* Line path */}
          {pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animate ? 1 : 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          )}

          {/* Data points */}
          {chartData.points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: animate ? index * 0.1 + 1 : 0,
                ease: "easeOut"
              }}
              className="drop-shadow-sm"
            />
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`gradient-${title.replace(/\s+/g, '-')}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/60 -ml-12">
          <span>{formatCoins(chartData.maxValue)}</span>
          <span>{formatCoins((chartData.maxValue + chartData.minValue) / 2)}</span>
          <span>{formatCoins(chartData.minValue)}</span>
        </div>
      </div>

      {/* X-axis labels */}
      {data.length > 0 && (
        <div className="flex justify-between mt-2 text-xs text-white/60">
          <span>{data[0] ? new Date(data[0].date).toLocaleDateString() : 'N/A'}</span>
          <span>{data.length > 0 && data[data.length - 1] ? new Date(data[data.length - 1]!.date).toLocaleDateString() : 'N/A'}</span>
        </div>
      )}
    </div>
  );
}

// Mini chart for compact displays
export function MiniStatsChart({ 
  data, 
  color = '#7c3aed',
  height = 60,
  className = ''
}: {
  data: DataPoint[];
  color?: string;
  height?: number;
  className?: string;
}) {
  const chartData = useMemo(() => {
    if (!data.length) return { points: [] };

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = data.map((point, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: ((maxValue - point.value) / range) * 80 + 10 // 10% padding
    }));

    return { points };
  }, [data]);

  const pathD = useMemo(() => {
    if (!chartData.points.length) return '';
    
    return chartData.points.reduce((acc, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${acc} ${command} ${point.x} ${point.y}`;
    }, '').trim();
  }, [chartData.points]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {pathD && (
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </svg>
    </div>
  );
}
import { useMemo } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'critical';
}

export function ScoreRing({
  score,
  size = 140,
  strokeWidth = 10,
  label,
  variant = 'primary',
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = useMemo(() => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  }, [variant]);

  const glowClass = useMemo(() => {
    switch (variant) {
      case 'success':
        return 'drop-shadow-[0_0_12px_hsl(var(--success)/0.5)]';
      case 'warning':
        return 'drop-shadow-[0_0_12px_hsl(var(--warning)/0.5)]';
      case 'critical':
        return 'drop-shadow-[0_0_12px_hsl(var(--destructive)/0.5)]';
      default:
        return 'drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]';
    }
  }, [variant]);

  return (
    <div className="score-ring">
      <svg width={size} height={size} className={`-rotate-90 ${glowClass}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${colorClass}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono text-3xl font-bold ${colorClass}`}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

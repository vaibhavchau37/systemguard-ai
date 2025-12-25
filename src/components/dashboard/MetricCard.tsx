import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'critical';
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  variant = 'default',
}: MetricCardProps) {
  const variantClasses = {
    default: 'border-border hover:border-primary/30',
    success: 'border-success/20 hover:border-success/40',
    warning: 'border-warning/20 hover:border-warning/40',
    critical: 'border-destructive/20 hover:border-destructive/40',
  };

  const glowClasses = {
    default: 'hover:shadow-glow',
    success: 'hover:shadow-glow-success',
    warning: 'hover:shadow-glow-warning',
    critical: 'hover:shadow-glow-critical',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColorClass =
    trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div
      className={`metric-card ${variantClasses[variant]} ${glowClasses[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-bold text-foreground">
              {value}
            </span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className={`mt-3 flex items-center gap-1.5 text-sm ${trendColorClass}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

import { TrustMetrics } from '@/lib/mockData';
import { Shield, TrendingUp, TrendingDown, Minus, Clock, Zap, Activity } from 'lucide-react';

interface TrustMeterProps {
  metrics: TrustMetrics;
}

export function TrustMeter({ metrics }: TrustMeterProps) {
  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getTrustBg = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const TrendIcon =
    metrics.trend === 'improving'
      ? TrendingUp
      : metrics.trend === 'declining'
      ? TrendingDown
      : Minus;

  const trendColor =
    metrics.trend === 'improving'
      ? 'text-success'
      : metrics.trend === 'declining'
      ? 'text-destructive'
      : 'text-muted-foreground';

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Trust Score</h3>
            <p className="text-xs text-muted-foreground">System reliability index</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span className="text-xs font-medium capitalize">{metrics.trend}</span>
        </div>
      </div>

      {/* Trust Score Display */}
      <div className="mt-6 flex items-end gap-4">
        <div className="flex flex-col">
          <span className={`font-mono text-5xl font-bold ${getTrustColor(metrics.overallScore)}`}>
            {metrics.overallScore}
          </span>
          <span className="text-sm text-muted-foreground">out of 100</span>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 pb-2">
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${getTrustBg(metrics.overallScore)}`}
              style={{ width: `${metrics.overallScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Trust Factors */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs">Failure Frequency</span>
          </div>
          <p className="mt-1 font-mono text-lg font-medium text-foreground">
            {metrics.failureFrequency}
            <span className="ml-1 text-xs text-muted-foreground">/week</span>
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">Avg Recovery</span>
          </div>
          <p className="mt-1 font-mono text-lg font-medium text-foreground">
            {metrics.avgRecoveryTime}
            <span className="ml-1 text-xs text-muted-foreground">min</span>
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span className="text-xs">Stability</span>
          </div>
          <p className="mt-1 font-mono text-lg font-medium text-foreground">
            {metrics.stabilityDuration}
            <span className="ml-1 text-xs text-muted-foreground">hrs</span>
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-xs">Severity Impact</span>
          </div>
          <p className="mt-1 font-mono text-lg font-medium text-foreground">
            {metrics.severityImpact}
            <span className="ml-1 text-xs text-muted-foreground">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

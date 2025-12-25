import { Insight, formatTimestamp } from '@/lib/mockData';
import { AlertCircle, AlertTriangle, Info, Lightbulb, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const typeConfig = {
    critical: {
      icon: AlertCircle,
      bg: 'bg-destructive/5',
      border: 'border-destructive/20 hover:border-destructive/40',
      iconBg: 'bg-destructive/10 text-destructive',
      badge: 'bg-destructive/10 text-destructive',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-warning/5',
      border: 'border-warning/20 hover:border-warning/40',
      iconBg: 'bg-warning/10 text-warning',
      badge: 'bg-warning/10 text-warning',
    },
    info: {
      icon: Info,
      bg: 'bg-chart-2/5',
      border: 'border-chart-2/20 hover:border-chart-2/40',
      iconBg: 'bg-chart-2/10 text-chart-2',
      badge: 'bg-chart-2/10 text-chart-2',
    },
    recommendation: {
      icon: Lightbulb,
      bg: 'bg-primary/5',
      border: 'border-primary/20 hover:border-primary/40',
      iconBg: 'bg-primary/10 text-primary',
      badge: 'bg-primary/10 text-primary',
    },
  };

  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <div
      className={`group rounded-xl border p-4 transition-all duration-300 ${config.bg} ${config.border}`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-lg p-2 ${config.iconBg}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatTimestamp(insight.timestamp)}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {insight.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {insight.component && (
                <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {insight.component}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3" />
                {insight.confidence}% confidence
              </span>
            </div>

            {insight.action && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
              >
                Take Action
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

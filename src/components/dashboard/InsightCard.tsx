import { Insight, formatTimestamp } from '@/lib/api';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Lightbulb, 
  ChevronRight, 
  Zap, 
  GitBranch, 
  Target, 
  Bot,
  Brain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);

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

  const hasAdvancedFeatures = insight.rootCause || insight.correlatedEvents?.length || insight.impactScore !== undefined || insight.reasoning;

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
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
              {insight.autoRemediationAvailable && (
                <span className="flex items-center gap-1 rounded-full bg-chart-2/10 px-2 py-0.5 text-[10px] font-medium text-chart-2">
                  <Bot className="h-3 w-3" />
                  Auto-Fix Ready
                </span>
              )}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatTimestamp(insight.timestamp)}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {insight.description}
          </p>

          {/* Impact & Confidence Metrics */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {insight.component && (
              <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {insight.component}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              {insight.confidence}% confidence
            </span>
            {insight.impactScore !== undefined && insight.impactScore > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                Impact: {insight.impactScore}/100
              </span>
            )}
            {insight.correlatedEvents && insight.correlatedEvents.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitBranch className="h-3 w-3" />
                {insight.correlatedEvents.length} correlated
              </span>
            )}
          </div>

          {/* Expandable Advanced Section */}
          {hasAdvancedFeatures && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Brain className="h-3 w-3" />
                {expanded ? 'Hide Analysis' : 'View Analysis'}
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>

              {expanded && (
                <div className="mt-3 space-y-2 rounded-lg bg-background/50 p-3 border border-border/50">
                  {/* Root Cause */}
                  {insight.rootCause && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Root Cause</span>
                      <p className="text-xs text-foreground mt-0.5">{insight.rootCause}</p>
                    </div>
                  )}

                  {/* Correlated Events */}
                  {insight.correlatedEvents && insight.correlatedEvents.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Correlated Services</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {insight.correlatedEvents.map((event, idx) => (
                          <span key={idx} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reasoning Chain */}
                  {insight.reasoning && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">AI Reasoning</span>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono bg-secondary/50 rounded px-2 py-1">
                        {insight.reasoning}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-3 flex items-center justify-between">
            <div />
            {insight.action && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 gap-1 px-2 text-xs ${
                  insight.autoRemediationAvailable 
                    ? 'text-chart-2 hover:bg-chart-2/10 hover:text-chart-2' 
                    : 'text-primary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {insight.autoRemediationAvailable ? 'Auto-Remediate' : 'Take Action'}
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

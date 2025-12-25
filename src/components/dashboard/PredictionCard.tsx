import { FailurePrediction } from '@/lib/mockData';
import { AlertTriangle, Clock, Target, ChevronRight } from 'lucide-react';

interface PredictionCardProps {
  prediction: FailurePrediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const severityStyles = {
    low: {
      bg: 'bg-success/5',
      border: 'border-success/20',
      text: 'text-success',
      badge: 'bg-success/10 text-success',
    },
    medium: {
      bg: 'bg-warning/5',
      border: 'border-warning/20',
      text: 'text-warning',
      badge: 'bg-warning/10 text-warning',
    },
    high: {
      bg: 'bg-destructive/5',
      border: 'border-destructive/20',
      text: 'text-destructive',
      badge: 'bg-destructive/10 text-destructive',
    },
  };

  const styles = severityStyles[prediction.severity];

  return (
    <div
      className={`group cursor-pointer rounded-xl border p-5 transition-all duration-300 hover:border-primary/30 ${styles.bg} ${styles.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${styles.badge}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">{prediction.component}</h3>
            <div className="mt-0.5 flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${styles.badge}`}>
                {prediction.severity} Risk
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>

      {/* Metrics Row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-lg bg-card/50 px-3 py-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            <span className="text-xs">Probability</span>
          </div>
          <span className={`mt-1 font-mono text-lg font-bold ${styles.text}`}>
            {prediction.probability}%
          </span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-card/50 px-3 py-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">Window</span>
          </div>
          <span className="mt-1 text-sm font-medium text-foreground">
            {prediction.expectedWindow}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-card/50 px-3 py-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-xs">Confidence</span>
          </div>
          <span className="mt-1 font-mono text-sm font-medium text-foreground">
            {prediction.confidence}%
          </span>
        </div>
      </div>

      {/* Contributing Factors */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Contributing Factors</p>
        <ul className="space-y-1.5">
          {prediction.factors.slice(0, 2).map((factor, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-foreground/80">
              <span className={`mt-1.5 h-1 w-1 rounded-full ${styles.text} opacity-60`} />
              {factor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

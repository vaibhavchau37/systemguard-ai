import { MainLayout } from '@/components/layout/MainLayout';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { failurePredictions } from '@/lib/mockData';
import { AlertTriangle, Clock, Target, TrendingUp } from 'lucide-react';

export default function FailurePrediction() {
  const highRiskCount = failurePredictions.filter((p) => p.severity === 'high').length;
  const avgProbability = Math.round(
    failurePredictions.reduce((sum, p) => sum + p.probability, 0) / failurePredictions.length
  );
  const avgConfidence = Math.round(
    failurePredictions.reduce((sum, p) => sum + p.confidence, 0) / failurePredictions.length
  );

  return (
    <MainLayout
      title="Failure Prediction"
      subtitle="AI-powered failure forecasting and risk analysis"
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="font-mono text-2xl font-bold text-foreground">{highRiskCount}</p>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Target className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Probability</p>
                <p className="font-mono text-2xl font-bold text-foreground">{avgProbability}%</p>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="font-mono text-2xl font-bold text-foreground">{avgConfidence}%</p>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Clock className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Predictions</p>
                <p className="font-mono text-2xl font-bold text-foreground">
                  {failurePredictions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Level Sections */}
        {(['high', 'medium', 'low'] as const).map((severity) => {
          const predictions = failurePredictions.filter((p) => p.severity === severity);
          if (predictions.length === 0) return null;

          return (
            <div key={severity}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold capitalize text-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${
                    severity === 'high'
                      ? 'bg-destructive'
                      : severity === 'medium'
                      ? 'bg-warning'
                      : 'bg-success'
                  }`}
                />
                {severity} Risk Predictions
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {predictions.map((prediction, index) => (
                  <div
                    key={prediction.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PredictionCard prediction={prediction} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}

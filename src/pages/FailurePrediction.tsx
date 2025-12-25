import { MainLayout } from '@/components/layout/MainLayout';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { useFailurePredictions } from '@/hooks/useApiData';
import { AlertTriangle, Clock, Target, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function FailurePrediction() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useFailurePredictions();
  
  const predictions = data?.predictions || [];
  const summary = data?.summary;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['failure-predictions'] });
  };

  return (
    <MainLayout
      title="Failure Prediction"
      subtitle="AI-powered failure forecasting and risk analysis"
    >
      <div className="space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="font-mono text-2xl font-bold text-foreground">
                  {isLoading ? '--' : summary?.highRiskCount ?? 0}
                </p>
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
                <p className="font-mono text-2xl font-bold text-foreground">
                  {isLoading ? '--' : `${summary?.avgProbability ?? 0}%`}
                </p>
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
                <p className="font-mono text-2xl font-bold text-foreground">
                  {isLoading ? '--' : `${summary?.avgConfidence ?? 0}%`}
                </p>
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
                  {isLoading ? '--' : predictions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Risk Level Sections */}
            {(['high', 'medium', 'low'] as const).map((severity) => {
              const filteredPredictions = predictions.filter((p) => p.severity === severity);
              if (filteredPredictions.length === 0) return null;

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
                    {filteredPredictions.map((prediction, index) => (
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
          </>
        )}
      </div>
    </MainLayout>
  );
}

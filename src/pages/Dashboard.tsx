import { MainLayout } from '@/components/layout/MainLayout';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { HealthTrendChart } from '@/components/dashboard/HealthTrendChart';
import { ComponentCard } from '@/components/dashboard/ComponentCard';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { TrustMeter } from '@/components/dashboard/TrustMeter';
import { useHealthMetrics, useFailurePredictions, useInsights, useTrustScore } from '@/hooks/useApiData';
import { Activity, AlertTriangle, Shield, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: healthData, isLoading: healthLoading, error: healthError } = useHealthMetrics();
  const { data: predictionsData, isLoading: predictionsLoading } = useFailurePredictions();
  const { data: insightsData, isLoading: insightsLoading } = useInsights();
  const { data: trustData, isLoading: trustLoading } = useTrustScore();

  const isLoading = healthLoading || predictionsLoading || insightsLoading || trustLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['failure-predictions'] });
    queryClient.invalidateQueries({ queryKey: ['insights'] });
    queryClient.invalidateQueries({ queryKey: ['trust-score'] });
  };

  const systemMetrics = healthData?.system;
  const components = healthData?.components || [];
  const predictions = predictionsData?.predictions || [];
  const insights = insightsData?.insights || [];
  const trustMetrics = trustData?.metrics;

  const criticalComponents = components.filter((c) => c.status === 'critical');
  const degradingComponents = components.filter((c) => c.status === 'degrading');

  if (healthError) {
    return (
      <MainLayout title="System Overview" subtitle="Real-time health monitoring and failure intelligence">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Failed to Load Data</h2>
          <p className="mt-1 text-sm text-muted-foreground">Unable to connect to backend services</p>
          <Button onClick={handleRefresh} className="mt-4 gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="System Overview"
      subtitle="Real-time health monitoring and failure intelligence"
    >
      <div className="space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Critical Alert Banner */}
        {criticalComponents.length > 0 && (
          <div className="animate-fade-in rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {criticalComponents.length} Critical Component
                    {criticalComponents.length > 1 ? 's' : ''} Detected
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Immediate attention required for{' '}
                    {criticalComponents.map((c) => c.name).join(', ')}
                  </p>
                </div>
              </div>
              <Link to="/health">
                <Button variant="destructive" size="sm" className="gap-1.5">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Main Metrics Row */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Health Score */}
          <div className="metric-card flex flex-col items-center justify-center py-8 animate-slide-up">
            {healthLoading ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : systemMetrics ? (
              <>
                <ScoreRing
                  score={systemMetrics.healthScore}
                  label="Health Score"
                  variant={
                    systemMetrics.healthScore >= 80
                      ? 'success'
                      : systemMetrics.healthScore >= 60
                      ? 'warning'
                      : 'critical'
                  }
                />
                <div className="mt-4">
                  <StatusBadge status={systemMetrics.status} size="lg" />
                </div>
              </>
            ) : null}
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-3 grid gap-4 sm:grid-cols-3 animate-slide-up delay-100">
            <MetricCard
              title="Trust Score"
              value={systemMetrics?.trustScore ?? '--'}
              unit="%"
              trend="up"
              trendValue="+2.4% from last week"
              icon={<Shield className="h-5 w-5 text-primary" />}
              variant={systemMetrics && systemMetrics.trustScore >= 80 ? 'success' : 'warning'}
            />
            <MetricCard
              title="Failure Risk"
              value={systemMetrics?.failureRisk ?? '--'}
              unit="%"
              trend="down"
              trendValue="-5.2% from yesterday"
              icon={<AlertTriangle className="h-5 w-5 text-warning" />}
              variant={
                systemMetrics
                  ? systemMetrics.failureRisk <= 20
                    ? 'success'
                    : systemMetrics.failureRisk <= 50
                    ? 'warning'
                    : 'critical'
                  : 'default'
              }
            />
            <MetricCard
              title="Active Services"
              value={`${components.filter((c) => c.status === 'healthy').length}/${components.length}`}
              trend="stable"
              trendValue="All core services running"
              icon={<Activity className="h-5 w-5 text-success" />}
              variant="default"
            />
          </div>
        </div>

        {/* Charts and Predictions Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 animate-slide-up delay-200">
            <HealthTrendChart />
          </div>
          <div className="animate-slide-up delay-300">
            {trustMetrics ? (
              <TrustMeter metrics={trustMetrics} />
            ) : (
              <div className="metric-card flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Failure Predictions */}
        <div className="animate-slide-up delay-400">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Failure Predictions</h2>
              <p className="text-sm text-muted-foreground">
                AI-powered risk assessment for your infrastructure
              </p>
            </div>
            <Link to="/prediction">
              <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {predictionsLoading ? (
              <div className="col-span-3 flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              predictions.slice(0, 3).map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))
            )}
          </div>
        </div>

        {/* Components and Insights */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Component Health */}
          <div className="animate-slide-up delay-500">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Component Health</h2>
                <p className="text-sm text-muted-foreground">
                  {degradingComponents.length + criticalComponents.length} components need attention
                </p>
              </div>
              <Link to="/health">
                <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {healthLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                components
                  .filter((c) => c.status !== 'healthy')
                  .slice(0, 3)
                  .map((component) => (
                    <ComponentCard key={component.id} component={component} />
                  ))
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="animate-slide-up delay-500">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
                <p className="text-sm text-muted-foreground">
                  Autonomous recommendations and alerts
                </p>
              </div>
              <Link to="/insights">
                <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {insightsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                insights.slice(0, 4).map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

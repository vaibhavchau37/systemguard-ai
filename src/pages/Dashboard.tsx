import { MainLayout } from '@/components/layout/MainLayout';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { HealthTrendChart } from '@/components/dashboard/HealthTrendChart';
import { ComponentCard } from '@/components/dashboard/ComponentCard';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { TrustMeter } from '@/components/dashboard/TrustMeter';
import {
  systemMetrics,
  componentHealth,
  failurePredictions,
  insights,
  trustMetrics,
} from '@/lib/mockData';
import { Activity, AlertTriangle, Shield, Gauge, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const criticalComponents = componentHealth.filter((c) => c.status === 'critical');
  const degradingComponents = componentHealth.filter((c) => c.status === 'degrading');

  return (
    <MainLayout
      title="System Overview"
      subtitle="Real-time health monitoring and failure intelligence"
    >
      <div className="space-y-6">
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
              <Button variant="destructive" size="sm" className="gap-1.5">
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Metrics Row */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Health Score */}
          <div className="metric-card flex flex-col items-center justify-center py-8 animate-slide-up">
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
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-3 grid gap-4 sm:grid-cols-3 animate-slide-up delay-100">
            <MetricCard
              title="Trust Score"
              value={systemMetrics.trustScore}
              unit="%"
              trend="up"
              trendValue="+2.4% from last week"
              icon={<Shield className="h-5 w-5 text-primary" />}
              variant={systemMetrics.trustScore >= 80 ? 'success' : 'warning'}
            />
            <MetricCard
              title="Failure Risk"
              value={systemMetrics.failureRisk}
              unit="%"
              trend="down"
              trendValue="-5.2% from yesterday"
              icon={<AlertTriangle className="h-5 w-5 text-warning" />}
              variant={
                systemMetrics.failureRisk <= 20
                  ? 'success'
                  : systemMetrics.failureRisk <= 50
                  ? 'warning'
                  : 'critical'
              }
            />
            <MetricCard
              title="Active Services"
              value={`${componentHealth.filter((c) => c.status === 'healthy').length}/${componentHealth.length}`}
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
            <TrustMeter metrics={trustMetrics} />
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
            {failurePredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
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
              {componentHealth
                .filter((c) => c.status !== 'healthy')
                .slice(0, 3)
                .map((component) => (
                  <ComponentCard key={component.id} component={component} />
                ))}
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
              {insights.slice(0, 4).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

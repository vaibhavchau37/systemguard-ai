import { MainLayout } from '@/components/layout/MainLayout';
import { TrustMeter } from '@/components/dashboard/TrustMeter';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { useTrustScore } from '@/hooks/useApiData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Shield, Award, Target, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function TrustReliability() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useTrustScore();

  const metrics = data?.metrics;
  const factors = data?.factors || [];
  const history = data?.history || [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['trust-score'] });
  };

  const chartData = history.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));

  const iconMap: Record<string, typeof Shield> = {
    'Uptime Consistency': Shield,
    'Error Rate Performance': Target,
    'Recovery Efficiency': TrendingUp,
    'Stability Index': Award,
  };

  return (
    <MainLayout
      title="Trust & Reliability"
      subtitle="System reliability metrics and trust scoring"
    >
      <div className="space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Main Trust Overview */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {metrics && <TrustMeter metrics={metrics} />}
              </div>
              <div className="metric-card flex flex-col items-center justify-center py-8">
                {metrics && (
                  <>
                    <ScoreRing
                      score={metrics.overallScore}
                      size={160}
                      label="Overall Trust"
                      variant={
                        metrics.overallScore >= 80
                          ? 'success'
                          : metrics.overallScore >= 60
                          ? 'warning'
                          : 'critical'
                      }
                    />
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      {metrics.overallScore >= 80
                        ? 'System is highly reliable'
                        : metrics.overallScore >= 60
                        ? 'System reliability needs attention'
                        : 'Critical reliability issues detected'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Trust Trend Chart */}
            <div className="metric-card h-[350px]">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-foreground">Trust Score History</h3>
                <p className="text-xs text-muted-foreground">Historical trust score over 24 hours</p>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trustGradientFull" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    name="Trust Score"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#trustGradientFull)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Trust Factors */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Trust Factor Breakdown</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {factors.map((factor, index) => {
                  const Icon = iconMap[factor.name] || Shield;
                  return (
                    <div
                      key={factor.name}
                      className="metric-card animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-foreground">{factor.name}</h3>
                            <p className="text-xs text-muted-foreground">{factor.description}</p>
                          </div>
                        </div>
                        <span
                          className={`font-mono text-2xl font-bold ${
                            factor.score >= 80
                              ? 'text-success'
                              : factor.score >= 60
                              ? 'text-warning'
                              : 'text-destructive'
                          }`}
                        >
                          {factor.score}
                        </span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            factor.score >= 80
                              ? 'bg-success'
                              : factor.score >= 60
                              ? 'bg-warning'
                              : 'bg-destructive'
                          }`}
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

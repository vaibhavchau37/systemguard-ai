import { MainLayout } from '@/components/layout/MainLayout';
import { TrustMeter } from '@/components/dashboard/TrustMeter';
import { ScoreRing } from '@/components/dashboard/ScoreRing';
import { trustMetrics, generateHealthTrend } from '@/lib/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import { Shield, Award, Target, TrendingUp } from 'lucide-react';

export default function TrustReliability() {
  const trustTrendData = useMemo(() => {
    return generateHealthTrend().map((point) => ({
      ...point,
      time: new Date(point.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
  }, []);

  const trustFactors = [
    {
      name: 'Uptime Consistency',
      score: 94,
      description: 'System availability over the last 30 days',
      icon: Shield,
    },
    {
      name: 'Error Rate Performance',
      score: 88,
      description: 'Aggregate error rate across all services',
      icon: Target,
    },
    {
      name: 'Recovery Efficiency',
      score: 76,
      description: 'Average time to recover from incidents',
      icon: TrendingUp,
    },
    {
      name: 'Stability Index',
      score: 91,
      description: 'Consistency of system performance',
      icon: Award,
    },
  ];

  return (
    <MainLayout
      title="Trust & Reliability"
      subtitle="System reliability metrics and trust scoring"
    >
      <div className="space-y-6">
        {/* Main Trust Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TrustMeter metrics={trustMetrics} />
          </div>
          <div className="metric-card flex flex-col items-center justify-center py-8">
            <ScoreRing
              score={trustMetrics.overallScore}
              size={160}
              label="Overall Trust"
              variant={
                trustMetrics.overallScore >= 80
                  ? 'success'
                  : trustMetrics.overallScore >= 60
                  ? 'warning'
                  : 'critical'
              }
            />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {trustMetrics.overallScore >= 80
                ? 'System is highly reliable'
                : trustMetrics.overallScore >= 60
                ? 'System reliability needs attention'
                : 'Critical reliability issues detected'}
            </p>
          </div>
        </div>

        {/* Trust Trend Chart */}
        <div className="metric-card h-[350px]">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground">Trust Score History</h3>
            <p className="text-xs text-muted-foreground">Historical trust score over 24 hours</p>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={trustTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                dataKey="trustScore"
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
            {trustFactors.map((factor, index) => (
              <div
                key={factor.name}
                className="metric-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <factor.icon className="h-5 w-5 text-primary" />
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
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

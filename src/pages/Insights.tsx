import { MainLayout } from '@/components/layout/MainLayout';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { useInsights } from '@/hooks/useApiData';
import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb, Loader2, RefreshCw, Brain, Bot, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

type InsightFilter = 'all' | 'critical' | 'warning' | 'info' | 'recommendation';

export default function Insights() {
  const [filter, setFilter] = useState<InsightFilter>('all');
  const queryClient = useQueryClient();
  const { data, isLoading } = useInsights();

  const insights = data?.insights || [];
  const summary = data?.summary;
  const engine = data?.engine;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['insights'] });
  };

  const filteredInsights = insights.filter((insight) => {
    if (filter === 'all') return true;
    return insight.type === filter;
  });

  const filterOptions: { value: InsightFilter; label: string; icon: typeof AlertCircle; count: number }[] = [
    {
      value: 'all',
      label: 'All',
      icon: Info,
      count: summary?.total ?? insights.length,
    },
    {
      value: 'critical',
      label: 'Critical',
      icon: AlertCircle,
      count: summary?.critical ?? insights.filter((i) => i.type === 'critical').length,
    },
    {
      value: 'warning',
      label: 'Warning',
      icon: AlertTriangle,
      count: summary?.warning ?? insights.filter((i) => i.type === 'warning').length,
    },
    {
      value: 'recommendation',
      label: 'Recommendations',
      icon: Lightbulb,
      count: summary?.recommendation ?? insights.filter((i) => i.type === 'recommendation').length,
    },
    {
      value: 'info',
      label: 'Info',
      icon: Info,
      count: summary?.info ?? insights.filter((i) => i.type === 'info').length,
    },
  ];

  return (
    <MainLayout
      title="AI Insights"
      subtitle="Autonomous recommendations and root cause analysis"
    >
      <div className="space-y-6">
        {/* Engine Info Banner */}
        {engine && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">{engine.name} v{engine.version}</h3>
                  <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {engine.capabilities?.map((cap: string, idx: number) => (
                    <span key={idx} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      <Cpu className="h-3 w-3" />
                      {cap}
                    </span>
                  ))}
                </div>
                {summary?.autoRemediationReady !== undefined && summary.autoRemediationReady > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-chart-2">
                    <Bot className="h-4 w-4" />
                    {summary.autoRemediationReady} insights have auto-remediation available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        {summary && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{summary.total}</div>
              <div className="text-xs text-muted-foreground">Total Insights</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-2xl font-bold text-primary">{summary.avgConfidence || 0}%</div>
              <div className="text-xs text-muted-foreground">Avg Confidence</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-2xl font-bold text-destructive">{summary.critical}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-2xl font-bold text-chart-2">{summary.autoRemediationReady || 0}</div>
              <div className="text-xs text-muted-foreground">Auto-Fix Ready</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                filter === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <option.icon className="h-4 w-4" />
              {option.label}
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                {isLoading ? '--' : option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Insights List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight, index) => (
              <div
                key={insight.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <InsightCard insight={insight} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredInsights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <Lightbulb className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No insights found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No {filter !== 'all' ? filter : ''} insights are currently available
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

import { MainLayout } from '@/components/layout/MainLayout';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { insights } from '@/lib/mockData';
import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react';

type InsightFilter = 'all' | 'critical' | 'warning' | 'info' | 'recommendation';

export default function Insights() {
  const [filter, setFilter] = useState<InsightFilter>('all');

  const filteredInsights = insights.filter((insight) => {
    if (filter === 'all') return true;
    return insight.type === filter;
  });

  const filterOptions: { value: InsightFilter; label: string; icon: typeof AlertCircle; count: number }[] = [
    {
      value: 'all',
      label: 'All',
      icon: Info,
      count: insights.length,
    },
    {
      value: 'critical',
      label: 'Critical',
      icon: AlertCircle,
      count: insights.filter((i) => i.type === 'critical').length,
    },
    {
      value: 'warning',
      label: 'Warning',
      icon: AlertTriangle,
      count: insights.filter((i) => i.type === 'warning').length,
    },
    {
      value: 'recommendation',
      label: 'Recommendations',
      icon: Lightbulb,
      count: insights.filter((i) => i.type === 'recommendation').length,
    },
    {
      value: 'info',
      label: 'Info',
      icon: Info,
      count: insights.filter((i) => i.type === 'info').length,
    },
  ];

  return (
    <MainLayout
      title="AI Insights"
      subtitle="Autonomous recommendations and root cause analysis"
    >
      <div className="space-y-6">
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
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Insights List */}
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

        {filteredInsights.length === 0 && (
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

import { ComponentHealth } from '@/lib/mockData';
import { StatusBadge } from './StatusBadge';
import { Database, Server, Layers, GitBranch, Globe } from 'lucide-react';

interface ComponentCardProps {
  component: ComponentHealth;
}

const typeIcons = {
  service: Server,
  database: Database,
  cache: Layers,
  queue: GitBranch,
  gateway: Globe,
};

export function ComponentCard({ component }: ComponentCardProps) {
  const Icon = typeIcons[component.type];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="metric-card group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              component.status === 'healthy'
                ? 'bg-success/10 text-success'
                : component.status === 'degrading'
                ? 'bg-warning/10 text-warning'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">{component.name}</h3>
            <p className="text-xs capitalize text-muted-foreground">{component.type}</p>
          </div>
        </div>
        <StatusBadge status={component.status} size="sm" />
      </div>

      {/* Health Score Bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Health Score</span>
          <span className={`font-mono text-sm font-medium ${getScoreColor(component.healthScore)}`}>
            {component.healthScore}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(component.healthScore)}`}
            style={{ width: `${component.healthScore}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-secondary/50 px-2.5 py-2 text-center">
          <p className="font-mono text-sm font-medium text-foreground">
            {component.errorRate}%
          </p>
          <p className="text-xs text-muted-foreground">Error Rate</p>
        </div>
        <div className="rounded-lg bg-secondary/50 px-2.5 py-2 text-center">
          <p className="font-mono text-sm font-medium text-foreground">
            {component.responseTime}ms
          </p>
          <p className="text-xs text-muted-foreground">Latency</p>
        </div>
        <div className="rounded-lg bg-secondary/50 px-2.5 py-2 text-center">
          <p className="font-mono text-sm font-medium text-foreground">
            {component.uptime}%
          </p>
          <p className="text-xs text-muted-foreground">Uptime</p>
        </div>
      </div>

      {component.lastIncident && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-1 w-1 rounded-full bg-warning" />
          Last incident: {component.lastIncident}
        </div>
      )}
    </div>
  );
}

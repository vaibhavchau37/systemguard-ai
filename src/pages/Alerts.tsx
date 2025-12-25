import { MainLayout } from '@/components/layout/MainLayout';
import { useAlerts } from '@/hooks/useApiData';
import { formatTimestamp } from '@/lib/api';
import { Bell, AlertTriangle, AlertCircle, CheckCircle, Clock, Zap, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function Alerts() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useAlerts();

  const alerts = data?.alerts || [];
  const summary = data?.summary;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
  };

  return (
    <MainLayout
      title="Alerts & Notifications"
      subtitle="Active incidents and risk notifications"
    >
      <div className="space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Alert Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="metric-card border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="font-mono text-2xl font-bold text-destructive">
                  {isLoading ? '--' : summary?.critical ?? 0}
                </p>
              </div>
            </div>
          </div>
          <div className="metric-card border-warning/20 bg-warning/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="font-mono text-2xl font-bold text-warning">
                  {isLoading ? '--' : summary?.warning ?? 0}
                </p>
              </div>
            </div>
          </div>
          <div className="metric-card border-success/20 bg-success/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="font-mono text-2xl font-bold text-success">
                  {isLoading ? '--' : summary?.resolvedToday ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Bell className="h-5 w-5" />
            Active Alerts
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className={`animate-slide-up rounded-xl border p-4 transition-all ${
                    alert.type === 'critical'
                      ? 'border-destructive/20 bg-destructive/5 hover:border-destructive/40'
                      : 'border-warning/20 bg-warning/5 hover:border-warning/40'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-lg p-2 ${
                          alert.type === 'critical'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {alert.type === 'critical' ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-foreground">{alert.title}</h3>
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${
                              alert.type === 'critical'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-warning/10 text-warning'
                            }`}
                          >
                            {alert.type}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{alert.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-4">
                          {alert.component && (
                            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                              {alert.component}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Zap className="h-3 w-3" />
                            {alert.confidence}% confidence
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {alert.action && (
                      <Button
                        size="sm"
                        variant={alert.type === 'critical' ? 'destructive' : 'outline'}
                        className="shrink-0"
                      >
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-success/10 p-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-medium text-foreground">All Clear</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No active alerts at this time
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

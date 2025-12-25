interface StatusBadgeProps {
  status: 'healthy' | 'degrading' | 'critical';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-sm',
  };

  const statusClasses = {
    healthy: 'health-healthy',
    degrading: 'health-warning',
    critical: 'health-critical',
  };

  const statusLabels = {
    healthy: 'Healthy',
    degrading: 'Degrading',
    critical: 'Critical',
  };

  return (
    <span className={`health-indicator ${statusClasses[status]} ${sizeClasses[size]}`}>
      <span
        className={`pulse-dot ${
          status === 'healthy'
            ? 'bg-success'
            : status === 'degrading'
            ? 'bg-warning'
            : 'bg-destructive'
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}

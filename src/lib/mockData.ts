// Mock data for the AI-Driven Software Health Platform

export interface SystemMetrics {
  healthScore: number;
  trustScore: number;
  failureRisk: number;
  status: 'healthy' | 'degrading' | 'critical';
  lastUpdated: string;
}

export interface ComponentHealth {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'queue' | 'gateway';
  status: 'healthy' | 'degrading' | 'critical';
  healthScore: number;
  errorRate: number;
  responseTime: number;
  uptime: number;
  lastIncident?: string;
}

export interface FailurePrediction {
  id: string;
  component: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  expectedWindow: string;
  factors: string[];
  confidence: number;
}

export interface TrustMetrics {
  overallScore: number;
  failureFrequency: number;
  avgRecoveryTime: number;
  stabilityDuration: number;
  severityImpact: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Insight {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'recommendation';
  title: string;
  description: string;
  component?: string;
  action?: string;
  confidence: number;
  timestamp: string;
}

export interface HealthTrendPoint {
  timestamp: string;
  healthScore: number;
  trustScore: number;
  failureRisk: number;
}

// Generate health trend data for the last 24 hours
export const generateHealthTrend = (): HealthTrendPoint[] => {
  const data: HealthTrendPoint[] = [];
  const now = new Date();
  
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseHealth = 85 + Math.sin(i * 0.3) * 10;
    const baseTrust = 82 + Math.cos(i * 0.25) * 8;
    const baseRisk = 15 + Math.sin(i * 0.4) * 12;
    
    data.push({
      timestamp: timestamp.toISOString(),
      healthScore: Math.min(100, Math.max(0, baseHealth + (Math.random() - 0.5) * 5)),
      trustScore: Math.min(100, Math.max(0, baseTrust + (Math.random() - 0.5) * 4)),
      failureRisk: Math.min(100, Math.max(0, baseRisk + (Math.random() - 0.5) * 8)),
    });
  }
  
  return data;
};

export const systemMetrics: SystemMetrics = {
  healthScore: 87,
  trustScore: 82,
  failureRisk: 18,
  status: 'healthy',
  lastUpdated: new Date().toISOString(),
};

export const componentHealth: ComponentHealth[] = [
  {
    id: 'auth-service',
    name: 'Authentication Service',
    type: 'service',
    status: 'healthy',
    healthScore: 98,
    errorRate: 0.02,
    responseTime: 45,
    uptime: 99.99,
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    type: 'gateway',
    status: 'healthy',
    healthScore: 94,
    errorRate: 0.15,
    responseTime: 120,
    uptime: 99.95,
  },
  {
    id: 'user-service',
    name: 'User Service',
    type: 'service',
    status: 'degrading',
    healthScore: 72,
    errorRate: 2.3,
    responseTime: 340,
    uptime: 99.8,
    lastIncident: '2 hours ago',
  },
  {
    id: 'postgres-primary',
    name: 'PostgreSQL Primary',
    type: 'database',
    status: 'healthy',
    healthScore: 96,
    errorRate: 0.01,
    responseTime: 8,
    uptime: 99.999,
  },
  {
    id: 'redis-cache',
    name: 'Redis Cache',
    type: 'cache',
    status: 'healthy',
    healthScore: 99,
    errorRate: 0,
    responseTime: 2,
    uptime: 99.999,
  },
  {
    id: 'payment-service',
    name: 'Payment Service',
    type: 'service',
    status: 'critical',
    healthScore: 45,
    errorRate: 8.5,
    responseTime: 890,
    uptime: 98.5,
    lastIncident: '15 minutes ago',
  },
  {
    id: 'notification-queue',
    name: 'Notification Queue',
    type: 'queue',
    status: 'healthy',
    healthScore: 91,
    errorRate: 0.3,
    responseTime: 15,
    uptime: 99.9,
  },
  {
    id: 'analytics-service',
    name: 'Analytics Service',
    type: 'service',
    status: 'healthy',
    healthScore: 88,
    errorRate: 0.8,
    responseTime: 180,
    uptime: 99.7,
  },
];

export const failurePredictions: FailurePrediction[] = [
  {
    id: 'pred-1',
    component: 'Payment Service',
    probability: 78,
    severity: 'high',
    expectedWindow: '2-4 hours',
    factors: [
      'Error rate increased 340% in last hour',
      'Memory utilization at 92%',
      'Connection pool exhaustion detected',
    ],
    confidence: 89,
  },
  {
    id: 'pred-2',
    component: 'User Service',
    probability: 45,
    severity: 'medium',
    expectedWindow: '6-12 hours',
    factors: [
      'Gradual response time degradation',
      'Database connection latency increasing',
      'Similar pattern before previous incident',
    ],
    confidence: 72,
  },
  {
    id: 'pred-3',
    component: 'API Gateway',
    probability: 22,
    severity: 'low',
    expectedWindow: '24-48 hours',
    factors: [
      'SSL certificate expires in 5 days',
      'Rate limiting approaching threshold',
    ],
    confidence: 65,
  },
];

export const trustMetrics: TrustMetrics = {
  overallScore: 82,
  failureFrequency: 2.3,
  avgRecoveryTime: 4.5,
  stabilityDuration: 168,
  severityImpact: 15,
  trend: 'stable',
};

export const insights: Insight[] = [
  {
    id: 'ins-1',
    type: 'critical',
    title: 'Payment Service Requires Immediate Attention',
    description: 'Connection pool exhaustion detected. Service is approaching critical failure threshold with 78% probability of failure within 2-4 hours.',
    component: 'Payment Service',
    action: 'Scale horizontally and investigate connection leak',
    confidence: 89,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ins-2',
    type: 'warning',
    title: 'User Service Performance Degradation',
    description: 'Response times have increased 180% over the last 2 hours. Database query optimization recommended.',
    component: 'User Service',
    action: 'Review slow query logs and add database indexes',
    confidence: 85,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'ins-3',
    type: 'recommendation',
    title: 'Proactive SSL Certificate Renewal',
    description: 'API Gateway SSL certificate expires in 5 days. Automated renewal recommended to prevent service disruption.',
    component: 'API Gateway',
    action: 'Trigger certificate renewal process',
    confidence: 100,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'ins-4',
    type: 'info',
    title: 'Redis Cache Performance Optimal',
    description: 'Cache hit ratio at 99.2%. No action required. Current configuration is performing above expectations.',
    component: 'Redis Cache',
    confidence: 95,
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: 'ins-5',
    type: 'warning',
    title: 'Memory Pressure Detected',
    description: 'Payment Service memory utilization at 92%. Consider increasing heap size or investigating memory leaks.',
    component: 'Payment Service',
    action: 'Analyze heap dump and optimize memory usage',
    confidence: 88,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
};

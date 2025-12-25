import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComponentHealth {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'queue' | 'gateway';
  status: 'healthy' | 'degrading' | 'critical';
  healthScore: number;
  errorRate: number;
  responseTime: number;
  uptime: number;
  cpuLoad: number;
  memoryUsage: number;
  lastIncident?: string;
}

interface SystemMetrics {
  healthScore: number;
  trustScore: number;
  failureRisk: number;
  status: 'healthy' | 'degrading' | 'critical';
  lastUpdated: string;
}

// Simulated time-series data for components (in production, this comes from Prometheus/Datadog)
const componentBaseMetrics: Record<string, { 
  baseErrorRate: number; 
  baseResponseTime: number; 
  baseUptime: number;
  baseCpu: number;
  baseMemory: number;
  volatility: number;
  trend: 'stable' | 'degrading' | 'recovering';
}> = {
  'auth-service': { baseErrorRate: 0.05, baseResponseTime: 45, baseUptime: 99.99, baseCpu: 25, baseMemory: 40, volatility: 0.1, trend: 'stable' },
  'api-gateway': { baseErrorRate: 0.2, baseResponseTime: 120, baseUptime: 99.95, baseCpu: 45, baseMemory: 55, volatility: 0.15, trend: 'stable' },
  'user-service': { baseErrorRate: 1.5, baseResponseTime: 280, baseUptime: 99.8, baseCpu: 60, baseMemory: 70, volatility: 0.3, trend: 'degrading' },
  'postgres-primary': { baseErrorRate: 0.01, baseResponseTime: 8, baseUptime: 99.999, baseCpu: 35, baseMemory: 65, volatility: 0.05, trend: 'stable' },
  'redis-cache': { baseErrorRate: 0, baseResponseTime: 2, baseUptime: 99.999, baseCpu: 15, baseMemory: 80, volatility: 0.02, trend: 'stable' },
  'payment-service': { baseErrorRate: 5, baseResponseTime: 450, baseUptime: 98.5, baseCpu: 85, baseMemory: 90, volatility: 0.5, trend: 'degrading' },
  'notification-queue': { baseErrorRate: 0.3, baseResponseTime: 15, baseUptime: 99.9, baseCpu: 30, baseMemory: 45, volatility: 0.1, trend: 'stable' },
  'analytics-service': { baseErrorRate: 0.8, baseResponseTime: 180, baseUptime: 99.7, baseCpu: 55, baseMemory: 60, volatility: 0.2, trend: 'stable' },
};

/**
 * HEALTH SCORE ALGORITHM
 * 
 * Health = weighted combination of:
 * - Error Rate Impact (30%): Lower is better, exponential penalty for high rates
 * - Response Time Impact (25%): Penalty for exceeding SLA thresholds
 * - Uptime Impact (20%): Near-linear with sharp penalty below 99%
 * - CPU Load Impact (15%): Exponential penalty above 80%
 * - Memory Usage Impact (10%): Exponential penalty above 85%
 */
function calculateHealthScore(
  errorRate: number,
  responseTime: number,
  uptime: number,
  cpuLoad: number,
  memoryUsage: number,
  componentType: string
): number {
  // Error Rate Score (0-100)
  // 0% error = 100, 1% = 90, 5% = 50, 10%+ = 0
  const errorScore = Math.max(0, 100 - (errorRate * 10) - Math.pow(errorRate, 2));

  // Response Time Score based on component type thresholds
  const slaThresholds: Record<string, number> = {
    cache: 10,
    database: 50,
    gateway: 200,
    service: 300,
    queue: 100,
  };
  const threshold = slaThresholds[componentType] || 200;
  const rtRatio = responseTime / threshold;
  const rtScore = rtRatio <= 1 ? 100 : Math.max(0, 100 - ((rtRatio - 1) * 50));

  // Uptime Score
  // 99.99% = 100, 99.9% = 95, 99% = 80, 98% = 50
  const uptimeScore = uptime >= 99.99 ? 100 
    : uptime >= 99.9 ? 95 
    : uptime >= 99.5 ? 88
    : uptime >= 99 ? 80
    : uptime >= 98 ? 50
    : Math.max(0, uptime - 48);

  // CPU Load Score - exponential penalty above 70%
  const cpuScore = cpuLoad <= 50 ? 100
    : cpuLoad <= 70 ? 100 - ((cpuLoad - 50) * 0.5)
    : cpuLoad <= 85 ? 90 - ((cpuLoad - 70) * 2)
    : Math.max(0, 60 - ((cpuLoad - 85) * 4));

  // Memory Score - exponential penalty above 80%
  const memScore = memoryUsage <= 60 ? 100
    : memoryUsage <= 80 ? 100 - ((memoryUsage - 60) * 0.5)
    : memoryUsage <= 90 ? 90 - ((memoryUsage - 80) * 3)
    : Math.max(0, 60 - ((memoryUsage - 90) * 6));

  // Weighted combination
  const healthScore = (
    errorScore * 0.30 +
    rtScore * 0.25 +
    uptimeScore * 0.20 +
    cpuScore * 0.15 +
    memScore * 0.10
  );

  return Math.round(Math.max(0, Math.min(100, healthScore)));
}

/**
 * Determine component status based on health score and critical indicators
 */
function determineStatus(
  healthScore: number,
  errorRate: number,
  cpuLoad: number,
  memoryUsage: number
): 'healthy' | 'degrading' | 'critical' {
  // Critical conditions (any one triggers critical)
  if (healthScore < 50) return 'critical';
  if (errorRate > 8) return 'critical';
  if (cpuLoad > 95 || memoryUsage > 95) return 'critical';
  
  // Degrading conditions
  if (healthScore < 75) return 'degrading';
  if (errorRate > 3) return 'degrading';
  if (cpuLoad > 80 || memoryUsage > 85) return 'degrading';
  
  return 'healthy';
}

/**
 * Simulate real-time metric variations with trend awareness
 */
function getCurrentMetrics(baseMetrics: typeof componentBaseMetrics[string]): {
  errorRate: number;
  responseTime: number;
  uptime: number;
  cpuLoad: number;
  memoryUsage: number;
} {
  const { baseErrorRate, baseResponseTime, baseUptime, baseCpu, baseMemory, volatility, trend } = baseMetrics;
  
  // Apply trend modifier
  const trendModifier = trend === 'degrading' ? 1.3 : trend === 'recovering' ? 0.8 : 1.0;
  
  // Add realistic noise within volatility bounds
  const noise = () => (Math.random() - 0.5) * 2 * volatility;
  
  return {
    errorRate: Math.max(0, baseErrorRate * trendModifier * (1 + noise())),
    responseTime: Math.max(1, Math.round(baseResponseTime * trendModifier * (1 + noise()))),
    uptime: Math.min(100, baseUptime - (trend === 'degrading' ? Math.random() * 0.5 : 0)),
    cpuLoad: Math.max(5, Math.min(99, baseCpu * trendModifier * (1 + noise() * 0.5))),
    memoryUsage: Math.max(10, Math.min(99, baseMemory * trendModifier * (1 + noise() * 0.3))),
  };
}

function computeHealthMetrics(): { system: SystemMetrics; components: ComponentHealth[] } {
  console.log('[health] Computing system health metrics using weighted algorithm...');
  
  const componentConfigs: { id: string; name: string; type: ComponentHealth['type'] }[] = [
    { id: 'auth-service', name: 'Authentication Service', type: 'service' },
    { id: 'api-gateway', name: 'API Gateway', type: 'gateway' },
    { id: 'user-service', name: 'User Service', type: 'service' },
    { id: 'postgres-primary', name: 'PostgreSQL Primary', type: 'database' },
    { id: 'redis-cache', name: 'Redis Cache', type: 'cache' },
    { id: 'payment-service', name: 'Payment Service', type: 'service' },
    { id: 'notification-queue', name: 'Notification Queue', type: 'queue' },
    { id: 'analytics-service', name: 'Analytics Service', type: 'service' },
  ];

  const components: ComponentHealth[] = componentConfigs.map((config) => {
    const baseMetrics = componentBaseMetrics[config.id];
    const metrics = getCurrentMetrics(baseMetrics);
    
    const healthScore = calculateHealthScore(
      metrics.errorRate,
      metrics.responseTime,
      metrics.uptime,
      metrics.cpuLoad,
      metrics.memoryUsage,
      config.type
    );
    
    const status = determineStatus(healthScore, metrics.errorRate, metrics.cpuLoad, metrics.memoryUsage);
    
    // Generate incident time for degraded/critical components
    let lastIncident: string | undefined;
    if (status !== 'healthy') {
      const minsAgo = Math.floor(Math.random() * 120) + 5;
      lastIncident = minsAgo < 60 ? `${minsAgo} minutes ago` : `${Math.floor(minsAgo / 60)} hours ago`;
    }
    
    return {
      ...config,
      status,
      healthScore,
      errorRate: +metrics.errorRate.toFixed(2),
      responseTime: metrics.responseTime,
      uptime: +metrics.uptime.toFixed(3),
      cpuLoad: +metrics.cpuLoad.toFixed(1),
      memoryUsage: +metrics.memoryUsage.toFixed(1),
      lastIncident,
    };
  });

  // Calculate system-level metrics
  const avgHealth = components.reduce((sum, c) => sum + c.healthScore, 0) / components.length;
  const criticalCount = components.filter(c => c.status === 'critical').length;
  const degradingCount = components.filter(c => c.status === 'degrading').length;

  // System status determination
  let systemStatus: 'healthy' | 'degrading' | 'critical' = 'healthy';
  if (criticalCount > 0) systemStatus = 'critical';
  else if (degradingCount >= 2 || avgHealth < 75) systemStatus = 'degrading';

  // Failure risk = inverse of health with boost for critical/degrading components
  const failureRisk = Math.round(
    (100 - avgHealth) * 0.5 + 
    criticalCount * 15 + 
    degradingCount * 8 +
    (avgHealth < 70 ? 10 : 0)
  );

  const system: SystemMetrics = {
    healthScore: Math.round(avgHealth),
    trustScore: Math.round(avgHealth * 0.9 + (100 - failureRisk) * 0.1),
    failureRisk: Math.min(100, Math.max(0, failureRisk)),
    status: systemStatus,
    lastUpdated: new Date().toISOString(),
  };

  console.log(`[health] Algorithm output - Health: ${system.healthScore}, Risk: ${system.failureRisk}, Status: ${system.status}`);
  console.log(`[health] Critical: ${criticalCount}, Degrading: ${degradingCount}`);
  
  return { system, components };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[health] Received request for health metrics');
    const { system, components } = computeHealthMetrics();

    return new Response(
      JSON.stringify({ system, components }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[health] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

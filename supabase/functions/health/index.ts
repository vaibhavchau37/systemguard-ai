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
  lastIncident?: string;
}

interface SystemMetrics {
  healthScore: number;
  trustScore: number;
  failureRisk: number;
  status: 'healthy' | 'degrading' | 'critical';
  lastUpdated: string;
}

// Simulate real metrics computation from system logs
function computeHealthMetrics(): { system: SystemMetrics; components: ComponentHealth[] } {
  console.log('[health] Computing system health metrics...');
  
  // Simulate analyzing system logs and metrics
  const components: ComponentHealth[] = [
    {
      id: 'auth-service',
      name: 'Authentication Service',
      type: 'service',
      status: 'healthy',
      healthScore: 95 + Math.floor(Math.random() * 5),
      errorRate: +(Math.random() * 0.1).toFixed(2),
      responseTime: 40 + Math.floor(Math.random() * 20),
      uptime: 99.99,
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      type: 'gateway',
      status: 'healthy',
      healthScore: 92 + Math.floor(Math.random() * 6),
      errorRate: +(Math.random() * 0.3).toFixed(2),
      responseTime: 100 + Math.floor(Math.random() * 50),
      uptime: 99.95,
    },
    {
      id: 'user-service',
      name: 'User Service',
      type: 'service',
      status: Math.random() > 0.7 ? 'degrading' : 'healthy',
      healthScore: 68 + Math.floor(Math.random() * 25),
      errorRate: +(Math.random() * 3).toFixed(2),
      responseTime: 200 + Math.floor(Math.random() * 200),
      uptime: 99.8,
      lastIncident: Math.random() > 0.5 ? `${Math.floor(Math.random() * 5) + 1} hours ago` : undefined,
    },
    {
      id: 'postgres-primary',
      name: 'PostgreSQL Primary',
      type: 'database',
      status: 'healthy',
      healthScore: 96 + Math.floor(Math.random() * 4),
      errorRate: +(Math.random() * 0.02).toFixed(3),
      responseTime: 5 + Math.floor(Math.random() * 10),
      uptime: 99.999,
    },
    {
      id: 'redis-cache',
      name: 'Redis Cache',
      type: 'cache',
      status: 'healthy',
      healthScore: 98 + Math.floor(Math.random() * 2),
      errorRate: 0,
      responseTime: 1 + Math.floor(Math.random() * 3),
      uptime: 99.999,
    },
    {
      id: 'payment-service',
      name: 'Payment Service',
      type: 'service',
      status: Math.random() > 0.6 ? 'critical' : 'degrading',
      healthScore: 35 + Math.floor(Math.random() * 35),
      errorRate: +(5 + Math.random() * 8).toFixed(1),
      responseTime: 700 + Math.floor(Math.random() * 400),
      uptime: 98.5,
      lastIncident: `${Math.floor(Math.random() * 30) + 5} minutes ago`,
    },
    {
      id: 'notification-queue',
      name: 'Notification Queue',
      type: 'queue',
      status: 'healthy',
      healthScore: 88 + Math.floor(Math.random() * 10),
      errorRate: +(Math.random() * 0.5).toFixed(2),
      responseTime: 10 + Math.floor(Math.random() * 15),
      uptime: 99.9,
    },
    {
      id: 'analytics-service',
      name: 'Analytics Service',
      type: 'service',
      status: 'healthy',
      healthScore: 85 + Math.floor(Math.random() * 10),
      errorRate: +(Math.random() * 1.2).toFixed(2),
      responseTime: 150 + Math.floor(Math.random() * 80),
      uptime: 99.7,
    },
  ];

  // Calculate overall system health
  const avgHealth = components.reduce((sum, c) => sum + c.healthScore, 0) / components.length;
  const criticalCount = components.filter(c => c.status === 'critical').length;
  const degradingCount = components.filter(c => c.status === 'degrading').length;

  let systemStatus: 'healthy' | 'degrading' | 'critical' = 'healthy';
  if (criticalCount > 0) systemStatus = 'critical';
  else if (degradingCount > 1) systemStatus = 'degrading';

  const system: SystemMetrics = {
    healthScore: Math.round(avgHealth),
    trustScore: Math.round(avgHealth * 0.95 + Math.random() * 5),
    failureRisk: Math.round(100 - avgHealth + (criticalCount * 10) + (degradingCount * 5)),
    status: systemStatus,
    lastUpdated: new Date().toISOString(),
  };

  console.log(`[health] Computed metrics - Health: ${system.healthScore}, Status: ${system.status}`);
  
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

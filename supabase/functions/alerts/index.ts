import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Alert {
  id: string;
  type: 'critical' | 'warning';
  title: string;
  description: string;
  component?: string;
  confidence: number;
  timestamp: string;
  action?: string;
  acknowledged: boolean;
}

// Generate active alerts based on current system state
function getActiveAlerts(): Alert[] {
  console.log('[alerts] Fetching active alerts...');

  const now = Date.now();
  const alerts: Alert[] = [];

  // Critical alerts
  if (Math.random() > 0.2) {
    alerts.push({
      id: `alert-crit-${now}-1`,
      type: 'critical',
      title: 'High Failure Risk: Payment Service',
      description: `${Math.floor(70 + Math.random() * 20)}% probability of failure within 2-4 hours. Connection pool exhaustion and memory pressure detected.`,
      component: 'Payment Service',
      confidence: 85 + Math.floor(Math.random() * 10),
      timestamp: new Date(now - Math.floor(Math.random() * 30) * 60000).toISOString(),
      action: 'Investigate and take preventive measures',
      acknowledged: false,
    });
  }

  if (Math.random() > 0.6) {
    alerts.push({
      id: `alert-crit-${now}-2`,
      type: 'critical',
      title: 'Database Connection Limit Warning',
      description: 'Connection pool utilization at 92%. Risk of connection exhaustion under high load.',
      component: 'PostgreSQL Primary',
      confidence: 90,
      timestamp: new Date(now - Math.floor(Math.random() * 20) * 60000).toISOString(),
      action: 'Increase connection pool size or optimize queries',
      acknowledged: false,
    });
  }

  // Warning alerts
  alerts.push({
    id: `alert-warn-${now}-1`,
    type: 'warning',
    title: 'User Service Response Time Degradation',
    description: `Response times have increased to ${Math.floor(300 + Math.random() * 200)}ms average. Performance investigation recommended.`,
    component: 'User Service',
    confidence: 82 + Math.floor(Math.random() * 10),
    timestamp: new Date(now - 45 * 60000).toISOString(),
    action: 'Review slow query logs and add database indexes',
    acknowledged: false,
  });

  if (Math.random() > 0.4) {
    alerts.push({
      id: `alert-warn-${now}-2`,
      type: 'warning',
      title: 'API Gateway Rate Limit Approaching',
      description: `Current request rate at ${Math.floor(75 + Math.random() * 20)}% of configured limit. Consider scaling or adjusting limits.`,
      component: 'API Gateway',
      confidence: 75 + Math.floor(Math.random() * 15),
      timestamp: new Date(now - 90 * 60000).toISOString(),
      action: 'Review traffic patterns and adjust rate limits',
      acknowledged: Math.random() > 0.7,
    });
  }

  if (Math.random() > 0.5) {
    alerts.push({
      id: `alert-warn-${now}-3`,
      type: 'warning',
      title: 'Notification Queue Backlog Growing',
      description: `Queue depth has increased ${Math.floor(150 + Math.random() * 100)}% in the last hour. Processing delays expected.`,
      component: 'Notification Queue',
      confidence: 70 + Math.floor(Math.random() * 15),
      timestamp: new Date(now - 120 * 60000).toISOString(),
      action: 'Scale queue consumers or investigate processing bottleneck',
      acknowledged: false,
    });
  }

  // Sort by type (critical first) then by timestamp (newest first)
  alerts.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'critical' ? -1 : 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  console.log(`[alerts] Found ${alerts.length} active alerts`);

  return alerts;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[alerts] Received alerts request');
    
    const alerts = getActiveAlerts();

    // Calculate summary
    const summary = {
      critical: alerts.filter(a => a.type === 'critical').length,
      warning: alerts.filter(a => a.type === 'warning').length,
      unacknowledged: alerts.filter(a => !a.acknowledged).length,
      total: alerts.length,
      resolvedToday: Math.floor(8 + Math.random() * 10),
    };

    return new Response(
      JSON.stringify({ alerts, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[alerts] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

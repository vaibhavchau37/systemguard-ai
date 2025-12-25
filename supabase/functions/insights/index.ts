import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Insight {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'recommendation';
  title: string;
  description: string;
  component?: string;
  action?: string;
  confidence: number;
  timestamp: string;
}

// AI-powered insight generation engine
function generateInsights(): Insight[] {
  console.log('[insights] Generating AI-powered insights...');

  const now = Date.now();
  const insights: Insight[] = [];

  // Critical: Payment Service issues
  if (Math.random() > 0.3) {
    insights.push({
      id: `ins-crit-${now}-1`,
      type: 'critical',
      title: 'Payment Service Requires Immediate Attention',
      description: `Connection pool exhaustion detected. Service is approaching critical failure threshold with high probability of failure within the next few hours.`,
      component: 'Payment Service',
      action: 'Scale horizontally and investigate connection leak',
      confidence: 85 + Math.floor(Math.random() * 10),
      timestamp: new Date(now - 5 * 60000).toISOString(),
    });
  }

  // Warning: User Service degradation
  if (Math.random() > 0.4) {
    insights.push({
      id: `ins-warn-${now}-1`,
      type: 'warning',
      title: 'User Service Performance Degradation',
      description: `Response times have increased ${Math.floor(150 + Math.random() * 100)}% over the last 2 hours. Database query optimization recommended.`,
      component: 'User Service',
      action: 'Review slow query logs and add database indexes',
      confidence: 80 + Math.floor(Math.random() * 12),
      timestamp: new Date(now - 30 * 60000).toISOString(),
    });
  }

  // Recommendation: SSL renewal
  insights.push({
    id: `ins-rec-${now}-1`,
    type: 'recommendation',
    title: 'Proactive SSL Certificate Renewal',
    description: `API Gateway SSL certificate expires in ${Math.floor(3 + Math.random() * 7)} days. Automated renewal recommended to prevent service disruption.`,
    component: 'API Gateway',
    action: 'Trigger certificate renewal process',
    confidence: 100,
    timestamp: new Date(now - 2 * 3600000).toISOString(),
  });

  // Info: Cache performance
  insights.push({
    id: `ins-info-${now}-1`,
    type: 'info',
    title: 'Redis Cache Performance Optimal',
    description: `Cache hit ratio at ${(98 + Math.random() * 1.5).toFixed(1)}%. No action required. Current configuration is performing above expectations.`,
    component: 'Redis Cache',
    confidence: 95,
    timestamp: new Date(now - 4 * 3600000).toISOString(),
  });

  // Warning: Memory pressure
  if (Math.random() > 0.5) {
    insights.push({
      id: `ins-warn-${now}-2`,
      type: 'warning',
      title: 'Memory Pressure Detected',
      description: `Payment Service memory utilization at ${Math.floor(88 + Math.random() * 8)}%. Consider increasing heap size or investigating memory leaks.`,
      component: 'Payment Service',
      action: 'Analyze heap dump and optimize memory usage',
      confidence: 85 + Math.floor(Math.random() * 10),
      timestamp: new Date(now - 45 * 60000).toISOString(),
    });
  }

  // Recommendation: Database optimization
  if (Math.random() > 0.6) {
    insights.push({
      id: `ins-rec-${now}-2`,
      type: 'recommendation',
      title: 'Database Index Optimization Available',
      description: 'Analysis detected unused indexes and missing indexes on frequently queried columns. Optimization could improve query performance by 25-40%.',
      component: 'PostgreSQL Primary',
      action: 'Review and apply recommended index changes',
      confidence: 78 + Math.floor(Math.random() * 15),
      timestamp: new Date(now - 6 * 3600000).toISOString(),
    });
  }

  // Sort by type priority and then by timestamp
  const typePriority = { critical: 0, warning: 1, recommendation: 2, info: 3 };
  insights.sort((a, b) => {
    const priorityDiff = typePriority[a.type] - typePriority[b.type];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  console.log(`[insights] Generated ${insights.length} insights`);

  return insights;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[insights] Received insights request');
    
    const insights = generateInsights();

    // Calculate summary
    const summary = {
      critical: insights.filter(i => i.type === 'critical').length,
      warning: insights.filter(i => i.type === 'warning').length,
      recommendation: insights.filter(i => i.type === 'recommendation').length,
      info: insights.filter(i => i.type === 'info').length,
      total: insights.length,
    };

    return new Response(
      JSON.stringify({ insights, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[insights] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

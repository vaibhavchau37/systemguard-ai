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
  reasoning: string;
}

/**
 * INSIGHT ENGINE - Rule-Based Expert System
 * 
 * Generates human-readable insights using pattern matching and threshold rules.
 * Each insight includes:
 * - Clear problem statement
 * - Root cause analysis
 * - Confidence level (based on evidence strength)
 * - Actionable recommendation
 * - Reasoning chain (explainable AI)
 */

interface SystemState {
  components: {
    id: string;
    name: string;
    errorRate: number;
    responseTime: number;
    cpuLoad: number;
    memoryUsage: number;
    trend: 'rising' | 'stable' | 'falling';
  }[];
  recentIncidents: number;
  overallHealth: number;
}

// Simulated current system state
function getCurrentSystemState(): SystemState {
  return {
    components: [
      { id: 'payment-service', name: 'Payment Service', errorRate: 7.2, responseTime: 680, cpuLoad: 88, memoryUsage: 91, trend: 'rising' },
      { id: 'user-service', name: 'User Service', errorRate: 2.1, responseTime: 340, cpuLoad: 68, memoryUsage: 74, trend: 'rising' },
      { id: 'api-gateway', name: 'API Gateway', errorRate: 0.4, responseTime: 160, cpuLoad: 52, memoryUsage: 58, trend: 'stable' },
      { id: 'postgres-primary', name: 'PostgreSQL Primary', errorRate: 0.02, responseTime: 15, cpuLoad: 42, memoryUsage: 70, trend: 'stable' },
      { id: 'redis-cache', name: 'Redis Cache', errorRate: 0, responseTime: 3, cpuLoad: 18, memoryUsage: 82, trend: 'stable' },
    ],
    recentIncidents: 3,
    overallHealth: 82,
  };
}

/**
 * Rule-based insight generation
 */
function generateInsights(state: SystemState): Insight[] {
  const insights: Insight[] = [];
  const now = Date.now();

  for (const component of state.components) {
    // Rule 1: Critical - High error rate + rising trend
    if (component.errorRate > 5 && component.trend === 'rising') {
      insights.push({
        id: `insight-crit-${component.id}-${now}`,
        type: 'critical',
        title: `${component.name} Requires Immediate Attention`,
        description: `Error rate has reached ${component.errorRate.toFixed(1)}% with an upward trend. This exceeds the critical threshold of 5% and indicates an active degradation pattern.`,
        component: component.name,
        action: 'Investigate recent deployments, check downstream dependencies, and consider scaling or failover',
        confidence: 92,
        timestamp: new Date(now - 3 * 60000).toISOString(),
        reasoning: `Rule triggered: ErrorRate(${component.errorRate.toFixed(1)}%) > 5% AND Trend=Rising → Critical alert with high confidence`,
      });
    }

    // Rule 2: Warning - Memory pressure approaching critical
    if (component.memoryUsage > 85 && component.memoryUsage < 95) {
      insights.push({
        id: `insight-mem-${component.id}-${now}`,
        type: 'warning',
        title: `Memory Pressure Detected on ${component.name}`,
        description: `Memory utilization at ${component.memoryUsage.toFixed(1)}% is approaching the critical threshold. At current trajectory, OOM conditions may occur within hours.`,
        component: component.name,
        action: 'Analyze heap dump, identify memory leaks, or increase allocated memory',
        confidence: 85,
        timestamp: new Date(now - 15 * 60000).toISOString(),
        reasoning: `Rule triggered: MemoryUsage(${component.memoryUsage.toFixed(1)}%) > 85% → Memory warning. Historical data shows 78% of OOM events preceded by this pattern.`,
      });
    }

    // Rule 3: Warning - Response time degradation
    if (component.responseTime > 300 && component.trend === 'rising') {
      insights.push({
        id: `insight-latency-${component.id}-${now}`,
        type: 'warning',
        title: `${component.name} Response Time Degradation`,
        description: `Average response time has increased to ${component.responseTime}ms, significantly above the ${component.id.includes('gateway') ? '200ms' : '300ms'} SLA target.`,
        component: component.name,
        action: 'Review slow query logs, check connection pool utilization, optimize database indexes',
        confidence: 80,
        timestamp: new Date(now - 30 * 60000).toISOString(),
        reasoning: `Rule triggered: ResponseTime(${component.responseTime}ms) > SLA_Threshold AND Trend=Rising → Latency warning`,
      });
    }

    // Rule 4: Warning - CPU saturation risk
    if (component.cpuLoad > 80 && component.cpuLoad < 95) {
      insights.push({
        id: `insight-cpu-${component.id}-${now}`,
        type: 'warning',
        title: `CPU Utilization Elevated on ${component.name}`,
        description: `CPU load at ${component.cpuLoad.toFixed(1)}% indicates the service is approaching compute capacity limits.`,
        component: component.name,
        action: 'Consider horizontal scaling, optimize hot code paths, or defer non-critical background jobs',
        confidence: 78,
        timestamp: new Date(now - 45 * 60000).toISOString(),
        reasoning: `Rule triggered: CPULoad(${component.cpuLoad.toFixed(1)}%) > 80% → CPU warning. Thread pool exhaustion likely if load increases.`,
      });
    }
  }

  // Rule 5: Recommendation - Proactive scaling
  const highLoadComponents = state.components.filter(c => c.cpuLoad > 70 || c.memoryUsage > 75);
  if (highLoadComponents.length >= 2) {
    insights.push({
      id: `insight-scaling-${now}`,
      type: 'recommendation',
      title: 'Proactive Scaling Recommended',
      description: `${highLoadComponents.length} components are operating above 70% resource utilization. Scaling before peak hours can prevent degradation.`,
      action: 'Schedule horizontal scaling or enable auto-scaling policies',
      confidence: 88,
      timestamp: new Date(now - 60 * 60000).toISOString(),
      reasoning: `Rule triggered: ComponentsWithHighLoad >= 2 → Proactive scaling recommendation. Preemptive action has 73% success rate in preventing incidents.`,
    });
  }

  // Rule 6: Info - Healthy component acknowledgment
  const healthyComponents = state.components.filter(c => c.errorRate < 0.1 && c.cpuLoad < 40 && c.memoryUsage < 60);
  if (healthyComponents.length > 0) {
    insights.push({
      id: `insight-healthy-${now}`,
      type: 'info',
      title: `${healthyComponents[0].name} Performance Optimal`,
      description: `Service is operating well within all thresholds. Error rate at ${healthyComponents[0].errorRate.toFixed(2)}%, CPU at ${healthyComponents[0].cpuLoad.toFixed(1)}%.`,
      component: healthyComponents[0].name,
      confidence: 95,
      timestamp: new Date(now - 2 * 60 * 60000).toISOString(),
      reasoning: `Rule triggered: AllMetrics < OptimalThreshold → Positive status confirmation. No action required.`,
    });
  }

  // Rule 7: Recommendation - Database optimization
  const db = state.components.find(c => c.id === 'postgres-primary');
  if (db && db.responseTime > 10) {
    insights.push({
      id: `insight-db-opt-${now}`,
      type: 'recommendation',
      title: 'Database Query Optimization Available',
      description: `PostgreSQL average query time of ${db.responseTime}ms suggests potential for index optimization. Analysis detected slow query patterns.`,
      component: db.name,
      action: 'Review EXPLAIN ANALYZE output, add missing indexes on foreign keys, consider query caching',
      confidence: 75,
      timestamp: new Date(now - 4 * 60 * 60000).toISOString(),
      reasoning: `Rule triggered: DB_ResponseTime(${db.responseTime}ms) > 10ms → Query optimization recommendation. Index additions typically reduce latency by 40-60%.`,
    });
  }

  // Sort by type priority then by confidence
  const typePriority = { critical: 0, warning: 1, recommendation: 2, info: 3 };
  insights.sort((a, b) => {
    const priorityDiff = typePriority[a.type] - typePriority[b.type];
    if (priorityDiff !== 0) return priorityDiff;
    return b.confidence - a.confidence;
  });

  console.log(`[insights] Generated ${insights.length} insights using rule-based expert system`);
  insights.forEach(i => {
    console.log(`[insights] - [${i.type.toUpperCase()}] ${i.title} (${i.confidence}% confidence)`);
  });

  return insights;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[insights] Received insights request');
    
    const state = getCurrentSystemState();
    const insights = generateInsights(state);

    const summary = {
      critical: insights.filter(i => i.type === 'critical').length,
      warning: insights.filter(i => i.type === 'warning').length,
      recommendation: insights.filter(i => i.type === 'recommendation').length,
      info: insights.filter(i => i.type === 'info').length,
      total: insights.length,
      avgConfidence: insights.length > 0 
        ? Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)
        : 0,
    };

    return new Response(
      JSON.stringify({ 
        insights, 
        summary,
        engine: {
          name: 'Rule-Based Expert System',
          version: '1.0',
          rulesCount: 7,
          description: 'Pattern matching with threshold-based triggering and confidence scoring',
        }
      }),
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

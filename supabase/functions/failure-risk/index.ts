import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FailurePrediction {
  id: string;
  component: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  expectedWindow: string;
  factors: string[];
  confidence: number;
  algorithm: string;
}

/**
 * FAILURE PREDICTION ALGORITHM
 * 
 * Uses pattern-based detection inspired by Netflix's Chaos Engineering principles:
 * 
 * 1. Trend Analysis: Detects rising patterns in error rates and latency
 * 2. Threshold Proximity: How close metrics are to known failure thresholds
 * 3. Correlation Detection: When multiple metrics degrade simultaneously
 * 4. Historical Pattern Matching: Similarity to pre-failure signatures
 * 
 * Probability = Σ(factor_weight × factor_score) with confidence adjustment
 */

interface ComponentMetrics {
  id: string;
  name: string;
  // Current metrics
  errorRate: number;
  responseTime: number;
  cpuLoad: number;
  memoryUsage: number;
  // Trend data (simulated time-series)
  errorRateTrend: number;      // % change over last hour
  responseTimeTrend: number;   // % change over last hour
  cpuTrend: number;            // % change over last hour
  memoryTrend: number;         // % change over last hour
  // Thresholds
  errorThreshold: number;
  latencyThreshold: number;
  cpuThreshold: number;
  memoryThreshold: number;
}

// Simulated component metrics with realistic trends
function getComponentMetrics(): ComponentMetrics[] {
  return [
    {
      id: 'payment-service',
      name: 'Payment Service',
      errorRate: 6.5 + Math.random() * 4,
      responseTime: 650 + Math.random() * 300,
      cpuLoad: 85 + Math.random() * 10,
      memoryUsage: 88 + Math.random() * 8,
      errorRateTrend: 180 + Math.random() * 120,  // Rising fast
      responseTimeTrend: 120 + Math.random() * 80,
      cpuTrend: 25 + Math.random() * 20,
      memoryTrend: 15 + Math.random() * 15,
      errorThreshold: 5,
      latencyThreshold: 500,
      cpuThreshold: 90,
      memoryThreshold: 90,
    },
    {
      id: 'user-service',
      name: 'User Service',
      errorRate: 1.8 + Math.random() * 1.5,
      responseTime: 320 + Math.random() * 100,
      cpuLoad: 65 + Math.random() * 15,
      memoryUsage: 72 + Math.random() * 10,
      errorRateTrend: 45 + Math.random() * 30,
      responseTimeTrend: 60 + Math.random() * 40,
      cpuTrend: 10 + Math.random() * 10,
      memoryTrend: 8 + Math.random() * 8,
      errorThreshold: 3,
      latencyThreshold: 400,
      cpuThreshold: 85,
      memoryThreshold: 85,
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      errorRate: 0.3 + Math.random() * 0.3,
      responseTime: 150 + Math.random() * 50,
      cpuLoad: 50 + Math.random() * 15,
      memoryUsage: 55 + Math.random() * 10,
      errorRateTrend: 5 + Math.random() * 10,
      responseTimeTrend: 10 + Math.random() * 15,
      cpuTrend: 3 + Math.random() * 5,
      memoryTrend: 2 + Math.random() * 3,
      errorThreshold: 2,
      latencyThreshold: 300,
      cpuThreshold: 80,
      memoryThreshold: 80,
    },
    {
      id: 'postgres-primary',
      name: 'PostgreSQL Primary',
      errorRate: 0.02 + Math.random() * 0.03,
      responseTime: 12 + Math.random() * 8,
      cpuLoad: 40 + Math.random() * 15,
      memoryUsage: 68 + Math.random() * 10,
      errorRateTrend: 2 + Math.random() * 5,
      responseTimeTrend: 8 + Math.random() * 10,
      cpuTrend: 5 + Math.random() * 5,
      memoryTrend: 3 + Math.random() * 3,
      errorThreshold: 1,
      latencyThreshold: 50,
      cpuThreshold: 80,
      memoryThreshold: 85,
    },
  ];
}

/**
 * Pattern-based failure probability calculation
 */
function calculateFailureProbability(metrics: ComponentMetrics): {
  probability: number;
  factors: string[];
  confidence: number;
  algorithm: string;
} {
  const factors: string[] = [];
  let riskScore = 0;
  let factorCount = 0;

  // Factor 1: Threshold Proximity (weight: 25%)
  const errorProximity = metrics.errorRate / metrics.errorThreshold;
  const latencyProximity = metrics.responseTime / metrics.latencyThreshold;
  const cpuProximity = metrics.cpuLoad / metrics.cpuThreshold;
  const memoryProximity = metrics.memoryUsage / metrics.memoryThreshold;

  if (errorProximity > 1) {
    riskScore += 25 * Math.min(2, errorProximity);
    factors.push(`Error rate ${(errorProximity * 100).toFixed(0)}% of threshold (${metrics.errorRate.toFixed(1)}% vs ${metrics.errorThreshold}%)`);
    factorCount++;
  }
  if (latencyProximity > 0.8) {
    riskScore += 20 * Math.min(2, latencyProximity);
    factors.push(`Response time at ${(latencyProximity * 100).toFixed(0)}% of SLA (${metrics.responseTime.toFixed(0)}ms vs ${metrics.latencyThreshold}ms)`);
    factorCount++;
  }
  if (cpuProximity > 0.85) {
    riskScore += 15 * Math.min(1.5, cpuProximity);
    factors.push(`CPU utilization at ${metrics.cpuLoad.toFixed(1)}%`);
    factorCount++;
  }
  if (memoryProximity > 0.9) {
    riskScore += 15 * Math.min(1.5, memoryProximity);
    factors.push(`Memory pressure at ${metrics.memoryUsage.toFixed(1)}%`);
    factorCount++;
  }

  // Factor 2: Trend Analysis (weight: 30%)
  // Rising trends indicate impending problems
  if (metrics.errorRateTrend > 50) {
    riskScore += Math.min(30, metrics.errorRateTrend * 0.15);
    factors.push(`Error rate increased ${metrics.errorRateTrend.toFixed(0)}% in last hour`);
    factorCount++;
  }
  if (metrics.responseTimeTrend > 40) {
    riskScore += Math.min(25, metrics.responseTimeTrend * 0.12);
    factors.push(`Response time degraded ${metrics.responseTimeTrend.toFixed(0)}% in last hour`);
    factorCount++;
  }

  // Factor 3: Correlation Detection (weight: 20%)
  // Multiple metrics degrading = higher risk
  const degradingMetrics = [
    errorProximity > 0.8,
    latencyProximity > 0.7,
    cpuProximity > 0.8,
    memoryProximity > 0.85,
  ].filter(Boolean).length;

  if (degradingMetrics >= 3) {
    riskScore += 20;
    factors.push('Multiple correlated metric degradation detected');
    factorCount++;
  } else if (degradingMetrics >= 2) {
    riskScore += 10;
  }

  // Factor 4: Historical Pattern Matching (weight: 15%)
  // Pattern: High memory + rising errors often precedes OOM crash
  if (memoryProximity > 0.9 && metrics.errorRateTrend > 100) {
    riskScore += 15;
    factors.push('Pattern match: Memory pressure + rising errors (pre-OOM signature)');
    factorCount++;
  }
  // Pattern: CPU saturation + latency spike = thread pool exhaustion
  if (cpuProximity > 0.9 && latencyProximity > 1.2) {
    riskScore += 15;
    factors.push('Pattern match: CPU saturation + latency spike (thread pool exhaustion)');
    factorCount++;
  }

  // Normalize to 0-100
  const probability = Math.min(100, Math.max(0, riskScore));

  // Confidence based on data quality (more factors = more confident)
  const confidence = Math.min(95, 50 + factorCount * 10);

  return {
    probability: Math.round(probability),
    factors: factors.slice(0, 4), // Top 4 factors
    confidence,
    algorithm: 'PatternBasedPrediction v1.0 (Threshold + Trend + Correlation + History)',
  };
}

/**
 * Estimate failure window based on trend velocity
 */
function estimateFailureWindow(probability: number, metrics: ComponentMetrics): string {
  const avgTrend = (metrics.errorRateTrend + metrics.responseTimeTrend) / 2;
  
  if (probability >= 80 && avgTrend > 150) return '30min-1hr';
  if (probability >= 70 && avgTrend > 100) return '1-2 hours';
  if (probability >= 60) return '2-4 hours';
  if (probability >= 45) return '4-8 hours';
  if (probability >= 30) return '8-24 hours';
  return '24-48 hours';
}

function determineSeverity(probability: number): 'low' | 'medium' | 'high' {
  if (probability >= 65) return 'high';
  if (probability >= 40) return 'medium';
  return 'low';
}

function predictFailures(): FailurePrediction[] {
  console.log('[failure-risk] Running pattern-based failure prediction engine...');
  
  const componentMetrics = getComponentMetrics();
  const predictions: FailurePrediction[] = [];

  for (const metrics of componentMetrics) {
    const { probability, factors, confidence, algorithm } = calculateFailureProbability(metrics);
    
    // Only include predictions with meaningful probability
    if (probability >= 15 || factors.length >= 2) {
      predictions.push({
        id: `pred-${metrics.id}-${Date.now()}`,
        component: metrics.name,
        probability,
        severity: determineSeverity(probability),
        expectedWindow: estimateFailureWindow(probability, metrics),
        factors,
        confidence,
        algorithm,
      });
    }
  }

  // Sort by probability (highest first)
  predictions.sort((a, b) => b.probability - a.probability);

  console.log(`[failure-risk] Generated ${predictions.length} predictions using pattern analysis`);
  predictions.forEach(p => {
    console.log(`[failure-risk] - ${p.component}: ${p.probability}% (${p.severity}) - ${p.factors.length} factors`);
  });
  
  return predictions;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[failure-risk] Received prediction request');
    
    const predictions = predictFailures();

    const summary = {
      highRiskCount: predictions.filter(p => p.severity === 'high').length,
      mediumRiskCount: predictions.filter(p => p.severity === 'medium').length,
      lowRiskCount: predictions.filter(p => p.severity === 'low').length,
      avgProbability: predictions.length > 0 
        ? Math.round(predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length)
        : 0,
      avgConfidence: predictions.length > 0
        ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)
        : 0,
      algorithmVersion: 'PatternBasedPrediction v1.0',
    };

    return new Response(
      JSON.stringify({ predictions, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[failure-risk] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

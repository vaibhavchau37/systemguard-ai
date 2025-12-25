import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrustMetrics {
  overallScore: number;
  failureFrequency: number;
  avgRecoveryTime: number;
  stabilityDuration: number;
  severityImpact: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface TrustFactor {
  name: string;
  score: number;
  description: string;
  weight: number;
}

interface TrustHistoryPoint {
  timestamp: string;
  score: number;
}

// Calculate trust score based on system reliability metrics
function calculateTrustScore(): {
  metrics: TrustMetrics;
  factors: TrustFactor[];
  history: TrustHistoryPoint[];
} {
  console.log('[trust-score] Calculating trust and reliability metrics...');

  // Simulate analyzing historical data
  const baseScore = 75 + Math.floor(Math.random() * 15);
  
  const factors: TrustFactor[] = [
    {
      name: 'Uptime Consistency',
      score: 90 + Math.floor(Math.random() * 8),
      description: 'System availability over the last 30 days',
      weight: 0.3,
    },
    {
      name: 'Error Rate Performance',
      score: 82 + Math.floor(Math.random() * 12),
      description: 'Aggregate error rate across all services',
      weight: 0.25,
    },
    {
      name: 'Recovery Efficiency',
      score: 70 + Math.floor(Math.random() * 18),
      description: 'Average time to recover from incidents',
      weight: 0.25,
    },
    {
      name: 'Stability Index',
      score: 85 + Math.floor(Math.random() * 12),
      description: 'Consistency of system performance',
      weight: 0.2,
    },
  ];

  // Calculate weighted overall score
  const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  const overallScore = Math.round(weightedScore);

  // Determine trend based on simulated historical comparison
  const trendRoll = Math.random();
  let trend: 'improving' | 'stable' | 'declining';
  if (trendRoll > 0.6) trend = 'improving';
  else if (trendRoll > 0.3) trend = 'stable';
  else trend = 'declining';

  const metrics: TrustMetrics = {
    overallScore,
    failureFrequency: +(1 + Math.random() * 3).toFixed(1),
    avgRecoveryTime: +(3 + Math.random() * 5).toFixed(1),
    stabilityDuration: Math.floor(120 + Math.random() * 100),
    severityImpact: Math.floor(10 + Math.random() * 15),
    trend,
  };

  // Generate historical data for the last 24 hours
  const history: TrustHistoryPoint[] = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString();
    const score = overallScore + (Math.random() - 0.5) * 10;
    history.push({
      timestamp,
      score: Math.max(0, Math.min(100, Math.round(score))),
    });
  }

  console.log(`[trust-score] Overall trust score: ${overallScore}, Trend: ${trend}`);

  return { metrics, factors, history };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[trust-score] Received trust score request');
    
    const { metrics, factors, history } = calculateTrustScore();

    return new Response(
      JSON.stringify({ metrics, factors, history }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[trust-score] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

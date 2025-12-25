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
  formula: string;
}

interface TrustHistoryPoint {
  timestamp: string;
  score: number;
}

/**
 * TRUST SCORE ALGORITHM 🔥 (Your Unique Differentiator)
 * 
 * Trust = Stability Over Time - Penalties
 * 
 * Formula:
 * TrustScore = BaseStability × (1 - FailurePenalty) × RecoveryBonus × ConsistencyMultiplier
 * 
 * Where:
 * - BaseStability: Days since last major incident (capped at 30 days = 100%)
 * - FailurePenalty: Frequency × Severity weighted sum
 * - RecoveryBonus: Inverse of MTTR (faster recovery = higher trust)
 * - ConsistencyMultiplier: Variance in uptime (lower variance = higher trust)
 * 
 * This is EXPLAINABLE AI - interviewers love this because you can justify every score.
 */

interface IncidentRecord {
  timestamp: Date;
  severity: 'minor' | 'major' | 'critical';
  durationMinutes: number;
  affectedComponents: number;
}

// Simulated incident history (in production, this comes from incident management system)
function getIncidentHistory(): IncidentRecord[] {
  const now = Date.now();
  return [
    { timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000), severity: 'minor', durationMinutes: 5, affectedComponents: 1 },
    { timestamp: new Date(now - 5 * 24 * 60 * 60 * 1000), severity: 'major', durationMinutes: 25, affectedComponents: 3 },
    { timestamp: new Date(now - 12 * 24 * 60 * 60 * 1000), severity: 'minor', durationMinutes: 8, affectedComponents: 1 },
    { timestamp: new Date(now - 18 * 24 * 60 * 60 * 1000), severity: 'critical', durationMinutes: 45, affectedComponents: 5 },
    { timestamp: new Date(now - 25 * 24 * 60 * 60 * 1000), severity: 'minor', durationMinutes: 3, affectedComponents: 1 },
  ];
}

/**
 * Calculate BaseStability: Time since last major/critical incident
 */
function calculateBaseStability(incidents: IncidentRecord[]): { score: number; description: string } {
  const majorIncidents = incidents.filter(i => i.severity !== 'minor');
  
  if (majorIncidents.length === 0) {
    return { score: 100, description: 'No major incidents in tracking period' };
  }
  
  const latestMajor = Math.max(...majorIncidents.map(i => i.timestamp.getTime()));
  const daysSinceIncident = (Date.now() - latestMajor) / (24 * 60 * 60 * 1000);
  
  // Score: 0-30 days maps to 50-100
  const score = Math.min(100, 50 + (daysSinceIncident / 30) * 50);
  
  return {
    score: Math.round(score),
    description: `${Math.round(daysSinceIncident)} days since last major incident`,
  };
}

/**
 * Calculate FailurePenalty based on incident frequency and severity
 */
function calculateFailurePenalty(incidents: IncidentRecord[]): { penalty: number; frequency: number; description: string } {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  
  const recentIncidents = incidents.filter(i => i.timestamp.getTime() > thirtyDaysAgo);
  
  // Severity weights
  const severityWeight = { minor: 1, major: 3, critical: 8 };
  
  const totalWeight = recentIncidents.reduce((sum, i) => sum + severityWeight[i.severity], 0);
  
  // Normalize: 0 incidents = 0 penalty, 10+ weighted incidents = max penalty
  const penalty = Math.min(0.4, totalWeight * 0.04); // Max 40% penalty
  
  return {
    penalty,
    frequency: recentIncidents.length,
    description: `${recentIncidents.length} incidents in last 30 days (weighted score: ${totalWeight})`,
  };
}

/**
 * Calculate RecoveryBonus based on MTTR (Mean Time To Recovery)
 */
function calculateRecoveryBonus(incidents: IncidentRecord[]): { bonus: number; mttr: number; description: string } {
  if (incidents.length === 0) {
    return { bonus: 1.1, mttr: 0, description: 'No incidents to measure recovery time' };
  }
  
  const avgRecoveryTime = incidents.reduce((sum, i) => sum + i.durationMinutes, 0) / incidents.length;
  
  // Bonus: <5 min = 1.15, 5-15 min = 1.1, 15-30 min = 1.05, 30-60 min = 1.0, >60 min = 0.95
  let bonus = 1.0;
  if (avgRecoveryTime < 5) bonus = 1.15;
  else if (avgRecoveryTime < 15) bonus = 1.1;
  else if (avgRecoveryTime < 30) bonus = 1.05;
  else if (avgRecoveryTime > 60) bonus = 0.95;
  
  return {
    bonus,
    mttr: Math.round(avgRecoveryTime * 10) / 10,
    description: `MTTR: ${avgRecoveryTime.toFixed(1)} minutes (${bonus > 1 ? 'bonus' : bonus < 1 ? 'penalty' : 'neutral'})`,
  };
}

/**
 * Calculate ConsistencyMultiplier based on uptime variance
 */
function calculateConsistencyMultiplier(): { multiplier: number; stabilityHours: number; description: string } {
  // Simulated: hours of stable operation in last 7 days
  const stableHours = 160 + Math.random() * 8; // Out of 168 hours
  const stabilityRatio = stableHours / 168;
  
  // Multiplier: 99%+ stability = 1.1, 98-99% = 1.05, 95-98% = 1.0, <95% = 0.95
  let multiplier = 1.0;
  if (stabilityRatio >= 0.99) multiplier = 1.1;
  else if (stabilityRatio >= 0.98) multiplier = 1.05;
  else if (stabilityRatio < 0.95) multiplier = 0.95;
  
  return {
    multiplier,
    stabilityHours: Math.round(stableHours),
    description: `${(stabilityRatio * 100).toFixed(2)}% uptime in last 7 days`,
  };
}

/**
 * Determine trust trend by comparing current week to previous week
 */
function determineTrend(currentScore: number): 'improving' | 'stable' | 'declining' {
  // Simulated previous week score
  const previousScore = currentScore + (Math.random() - 0.5) * 10;
  const delta = currentScore - previousScore;
  
  if (delta > 3) return 'improving';
  if (delta < -3) return 'declining';
  return 'stable';
}

function calculateTrustScore(): {
  metrics: TrustMetrics;
  factors: TrustFactor[];
  history: TrustHistoryPoint[];
} {
  console.log('[trust-score] Calculating trust using stability-penalty algorithm...');
  
  const incidents = getIncidentHistory();
  
  // Calculate each component
  const stability = calculateBaseStability(incidents);
  const failurePenalty = calculateFailurePenalty(incidents);
  const recoveryBonus = calculateRecoveryBonus(incidents);
  const consistency = calculateConsistencyMultiplier();
  
  // Apply the Trust Formula
  const rawScore = stability.score * (1 - failurePenalty.penalty) * recoveryBonus.bonus * consistency.multiplier;
  const overallScore = Math.round(Math.min(100, Math.max(0, rawScore)));
  
  console.log(`[trust-score] Formula: ${stability.score} × (1 - ${failurePenalty.penalty.toFixed(2)}) × ${recoveryBonus.bonus} × ${consistency.multiplier} = ${overallScore}`);
  
  const factors: TrustFactor[] = [
    {
      name: 'Stability Duration',
      score: stability.score,
      description: stability.description,
      weight: 0.35,
      formula: 'min(100, 50 + (daysSinceIncident / 30) × 50)',
    },
    {
      name: 'Incident Impact',
      score: Math.round(100 - failurePenalty.penalty * 100),
      description: failurePenalty.description,
      weight: 0.30,
      formula: '100 - (Σ severity_weight × 4)',
    },
    {
      name: 'Recovery Efficiency',
      score: Math.round((recoveryBonus.bonus - 0.9) * 500), // Normalize to 0-100
      description: recoveryBonus.description,
      weight: 0.20,
      formula: 'MTTR < 5min → 1.15, < 15min → 1.1, < 30min → 1.05',
    },
    {
      name: 'Consistency Index',
      score: Math.round((consistency.multiplier - 0.9) * 500), // Normalize to 0-100
      description: consistency.description,
      weight: 0.15,
      formula: 'uptimeRatio >= 99% → 1.1, >= 98% → 1.05',
    },
  ];

  const metrics: TrustMetrics = {
    overallScore,
    failureFrequency: failurePenalty.frequency / 4, // Weekly rate
    avgRecoveryTime: recoveryBonus.mttr,
    stabilityDuration: consistency.stabilityHours,
    severityImpact: Math.round(failurePenalty.penalty * 100),
    trend: determineTrend(overallScore),
  };

  // Generate historical trust scores (simulated time-series)
  const history: TrustHistoryPoint[] = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000).toISOString();
    // Add realistic variance around current score
    const score = Math.max(50, Math.min(100, overallScore + (Math.random() - 0.5) * 8));
    history.push({ timestamp, score: Math.round(score) });
  }

  console.log(`[trust-score] Final score: ${overallScore}, Trend: ${metrics.trend}`);

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
      JSON.stringify({ 
        metrics, 
        factors, 
        history,
        algorithm: {
          name: 'StabilityMinusPenalties Trust Model',
          version: '1.0',
          formula: 'TrustScore = BaseStability × (1 - FailurePenalty) × RecoveryBonus × ConsistencyMultiplier',
        }
      }),
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

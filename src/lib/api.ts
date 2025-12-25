import { supabase } from "@/integrations/supabase/client";

// Types matching the edge function responses
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

export interface TrustFactor {
  name: string;
  score: number;
  description: string;
  weight: number;
}

export interface TrustHistoryPoint {
  timestamp: string;
  score: number;
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
  reasoning?: string;
  rootCause?: string;
  correlatedEvents?: string[];
  impactScore?: number;
  autoRemediationAvailable?: boolean;
}

export interface Alert {
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

// API functions
export async function fetchHealthMetrics(): Promise<{
  system: SystemMetrics;
  components: ComponentHealth[];
}> {
  const { data, error } = await supabase.functions.invoke('health');
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchFailurePredictions(): Promise<{
  predictions: FailurePrediction[];
  summary: {
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    avgProbability: number;
    avgConfidence: number;
  };
}> {
  const { data, error } = await supabase.functions.invoke('failure-risk');
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchTrustScore(): Promise<{
  metrics: TrustMetrics;
  factors: TrustFactor[];
  history: TrustHistoryPoint[];
}> {
  const { data, error } = await supabase.functions.invoke('trust-score');
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchInsights(): Promise<{
  insights: Insight[];
  summary: {
    critical: number;
    warning: number;
    recommendation: number;
    info: number;
    total: number;
    avgConfidence?: number;
    avgImpactScore?: number;
    autoRemediationReady?: number;
  };
  engine?: {
    name: string;
    version: string;
    capabilities: string[];
    algorithms: Record<string, string>;
  };
}> {
  const { data, error } = await supabase.functions.invoke('insights');
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchAlerts(): Promise<{
  alerts: Alert[];
  summary: {
    critical: number;
    warning: number;
    unacknowledged: number;
    total: number;
    resolvedToday: number;
  };
}> {
  const { data, error } = await supabase.functions.invoke('alerts');
  if (error) throw new Error(error.message);
  return data;
}

// Utility function
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

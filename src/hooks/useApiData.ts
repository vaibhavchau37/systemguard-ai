import { useQuery } from '@tanstack/react-query';
import {
  fetchHealthMetrics,
  fetchFailurePredictions,
  fetchTrustScore,
  fetchInsights,
  fetchAlerts,
} from '@/lib/api';

export function useHealthMetrics() {
  return useQuery({
    queryKey: ['health-metrics'],
    queryFn: fetchHealthMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });
}

export function useFailurePredictions() {
  return useQuery({
    queryKey: ['failure-predictions'],
    queryFn: fetchFailurePredictions,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });
}

export function useTrustScore() {
  return useQuery({
    queryKey: ['trust-score'],
    queryFn: fetchTrustScore,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: fetchInsights,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000, // Refresh every 15 seconds for alerts
    staleTime: 5000,
  });
}

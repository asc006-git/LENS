import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Portfolio, Achievement } from '@/types';

export function usePortfolio() {
  return useQuery<Portfolio>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.PORTFOLIO.BASE);
      return res.data || res;
    },
  });
}

export function useLearningDNA() {
  return useQuery({
    queryKey: ['portfolio', 'dna'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.PORTFOLIO.DNA);
      return res.data || res;
    },
  });
}

export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['portfolio', 'achievements'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.ACHIEVEMENTS.BASE);
      return res.data || res;
    },
  });
}

export function usePortfolioAnalytics() {
  return useQuery({
    queryKey: ['portfolio', 'analytics'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.DASHBOARD.STUDENT);
      const data = res.data || res;
      return {
        totalSessions: data.stats?.totalSessions || 0,
        averageAuthenticity: data.stats?.averageConfidence || 0,
        conceptsMastered: data.stats?.masteredConcepts || 0,
        currentStreak: data.streak || 0,
      };
    },
  });
}

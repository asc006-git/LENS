import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Recommendation } from '@/types';

export function useRecommendations() {
  return useQuery<Recommendation[]>({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.RECOMMENDATIONS.STUDENT);
      return res.data || res;
    },
  });
}

export function useAcceptRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.RECOMMENDATIONS.ACCEPT(id));
      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
}



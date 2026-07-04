import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { DashboardData } from '@/types';

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', 'student'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.DASHBOARD.STUDENT);
      return res.data || res;
    },
  });
}

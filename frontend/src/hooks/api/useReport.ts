import { useQuery } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Report } from '@/types';

export function useReport(sessionId: string) {
  return useQuery<Report>({
    queryKey: ['reports', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.SESSIONS.REPORT(sessionId));
      return data?.data || data;
    },
    enabled: !!sessionId,
  });
}

export function useAllReports() {
  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REPORTS.ALL);
      return data?.data || data;
    },
  });
}

export function useExportReport(sessionId: string) {
  return useQuery({
    queryKey: ['reports', 'export', sessionId],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.REPORTS.EXPORT(sessionId), {
        responseType: 'blob',
      });
      return data;
    },
    enabled: false,
  });
}

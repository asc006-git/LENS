import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Blueprint } from '@/types';

export function useBlueprint(sessionId: string) {
  return useQuery<Blueprint>({
    queryKey: ['blueprints', sessionId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.SESSIONS.BLUEPRINT(sessionId));
      return res.data || res;
    },
    enabled: !!sessionId,
  });
}

export function useConfirmBlueprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blueprintId, confirmed }: { blueprintId: string; confirmed: boolean }) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.BLUEPRINTS.CONFIRM(blueprintId), { confirmed });
      return res.data || res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blueprints', variables.blueprintId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useUpdateBlueprint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blueprintId, updates }: { blueprintId: string; updates: Partial<Blueprint> }) => {
      const { data: res } = await apiClient.put(API_ENDPOINTS.BLUEPRINTS.UPDATE(blueprintId), updates);
      return res.data || res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blueprints', variables.blueprintId] });
    },
  });
}

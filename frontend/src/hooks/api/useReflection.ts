import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Reflection } from '@/types';

export function useReflection(sessionId: string) {
  return useQuery<Reflection>({
    queryKey: ['reflections', sessionId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.SESSIONS.REFLECTION(sessionId));
      return res.data || res;
    },
    enabled: !!sessionId,
  });
}

export function useUpdateReflectionSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reflectionId,
      sectionId,
      content,
    }: {
      reflectionId: string;
      sectionId: string;
      content: string;
    }) => {
      const { data: res } = await apiClient.put(
        API_ENDPOINTS.REFLECTIONS.UPDATE_SECTION(reflectionId, sectionId),
        { content }
      );
      return res.data || res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
    },
  });
}

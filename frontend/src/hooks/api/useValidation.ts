import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Validation } from '@/types';

export function useValidation(sessionId: string) {
  return useQuery<Validation>({
    queryKey: ['validations', sessionId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.SESSIONS.VALIDATION(sessionId));
      return res.data || res;
    },
    enabled: !!sessionId,
  });
}

export function useStartValidation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data: res } = await apiClient.post(`${API_ENDPOINTS.SESSIONS.VALIDATION(sessionId)}/start`);
      return res.data || res;
    },
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['validations', sessionId] });
    },
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      questionId,
      answer,
      timeSpent,
      confidence,
    }: {
      sessionId: string;
      questionId: string;
      answer: string;
      timeSpent: number;
      confidence: number;
    }) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.SESSIONS.SUBMIT_ANSWER(sessionId), {
        questionId,
        answer,
        timeSpent,
        confidence,
      });
      return res.data || res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['validations', variables.sessionId] });
    },
  });
}

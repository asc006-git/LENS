import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { LearningSession } from '@/types';

export function useLearningSessions() {
  return useQuery<LearningSession[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.SESSIONS.BASE);
      return res.data || res;
    },
  });
}

export function useLearningSession(sessionId: string) {
  return useQuery<LearningSession>({
    queryKey: ['sessions', sessionId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.SESSIONS.BY_ID(sessionId));
      return res.data || res;
    },
    enabled: !!sessionId,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionData: {
      courseId: string;
      title: string;
      description: string;
      assignmentContent: string;
      learningObjective: string;
      aiConfig: {
        difficulty: string;
        learningStyle: string;
        timeEstimate: number;
        adaptiveDifficulty: boolean;
      };
    }) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.SESSIONS.BASE, sessionData);
      const result = res.data || res;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useSessionAnalysis(sessionId: string) {
  return useQuery({
    queryKey: ['sessions', sessionId, 'analysis'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.SESSIONS.ANALYSIS(sessionId));
      return res.data || res;
    },
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'analyzing') return 3000;
      return false;
    },
  });
}

export function useSessionGuidedLearning(sessionId: string) {
  return useQuery({
    queryKey: ['sessions', sessionId, 'guided-learning'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.SESSIONS.GUIDED_LEARNING(sessionId));
      return res.data || res;
    },
    enabled: !!sessionId,
  });
}

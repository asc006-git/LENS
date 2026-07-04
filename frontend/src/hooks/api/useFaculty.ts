import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Course, Intervention, ConceptHeatmapData } from '@/types';

export function useFacultyCourses() {
  return useQuery<Course[]>({
    queryKey: ['faculty', 'courses'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.FACULTY.COURSES);
      return res.data || res;
    },
  });
}

export function useFacultyCourse(courseId: string) {
  return useQuery<Course>({
    queryKey: ['faculty', 'courses', courseId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.FACULTY.COURSE_BY_ID(courseId));
      return res.data || res;
    },
    enabled: !!courseId,
  });
}

export function useStudentIntelligence(studentId: string) {
  return useQuery({
    queryKey: ['faculty', 'students', studentId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.FACULTY.STUDENT_BY_ID(studentId));
      return res.data || res;
    },
    enabled: !!studentId,
  });
}

export function useConceptHeatmap() {
  return useQuery<ConceptHeatmapData[]>({
    queryKey: ['faculty', 'concept-heatmap'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.FACULTY.ANALYTICS);
      return res.data || res;
    },
  });
}

export function useInterventions() {
  return useQuery<Intervention[]>({
    queryKey: ['faculty', 'interventions'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.FACULTY.INTERVENTIONS);
      return res.data || res;
    },
  });
}

export function useCreateIntervention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (intervention: Omit<Intervention, 'id' | 'createdAt'>) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.FACULTY.INTERVENTIONS, intervention);
      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty', 'interventions'] });
    },
  });
}

export function useFacultyInsights() {
  return useQuery({
    queryKey: ['faculty', 'insights'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.FACULTY.INSIGHTS);
      return res.data || res;
    },
  });
}

export function useFacultyDashboard() {
  return useQuery({
    queryKey: ['faculty', 'dashboard'],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.DASHBOARD.FACULTY);
      return res.data || res;
    },
  });
}

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
      const { data: res } = await apiClient.get(API_ENDPOINTS.DASHBOARD.FACULTY);
      return (res.data?.conceptHeatmap) || [];
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

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; code: string; description?: string; semester?: string }) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.COURSES.BASE, data);
      return res.data || res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty', 'courses'] });
    },
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, ...data }: { courseId: string; title: string; description?: string; dueDate?: string; expectedConcepts?: string[]; rubricCriteria?: string[]; learningObjectives?: string[]; facultyNotes?: string }) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.COURSES.ASSIGNMENTS(courseId), data);
      return res.data || res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faculty', 'courses', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['faculty', 'assignments', variables.courseId] });
    },
  });
}

export function useEnrollStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, email }: { courseId: string; email: string }) => {
      const { data: res } = await apiClient.post(API_ENDPOINTS.COURSES.ENROLL_STUDENT(courseId), { email });
      return res.data || res;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faculty', 'courses', variables.courseId] });
    },
  });
}

export function useCourseAssignments(courseId: string) {
  return useQuery({
    queryKey: ['faculty', 'assignments', courseId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(API_ENDPOINTS.COURSES.ASSIGNMENTS(courseId));
      return res.data || res;
    },
    enabled: !!courseId,
  });
}

export function useFacultyImpact(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['faculty', 'impact', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      const qs = params.toString();
      const { data: res } = await apiClient.get(`${API_ENDPOINTS.FACULTY.IMPACT}${qs ? `?${qs}` : ''}`);
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

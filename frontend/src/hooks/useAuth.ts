import { useAuthStore } from '@/state/authStore';

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, login, register, logout, updateUser } = useAuthStore();

  const hasRole = (role: string) => user?.role === role;
  const isStudent = user?.role === 'student';
  const isFaculty = user?.role === 'faculty';
  const isInstitution = user?.role === 'institution';

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isStudent,
    isFaculty,
    isInstitution,
  };
}

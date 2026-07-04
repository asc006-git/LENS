import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import RoleGuard from './guards/RoleGuard';
import PublicLayout from '@/components/layout/PublicLayout';
import StudentLayout from '@/components/layout/StudentLayout';
import FacultyLayout from '@/components/layout/FacultyLayout';

import LandingPage from '@/pages/public/LandingPage';
import AboutPage from '@/pages/public/AboutPage';
import FeaturesPage from '@/pages/public/FeaturesPage';
import ContactPage from '@/pages/public/ContactPage';
import LoginPage from '@/pages/public/LoginPage';
import RegisterPage from '@/pages/public/RegisterPage';

import StudentDashboard from '@/pages/student/Dashboard';
import CreateLearningSession from '@/pages/student/CreateLearningSession';
import SessionAnalysis from '@/pages/student/SessionAnalysis';
import SessionBlueprint from '@/pages/student/SessionBlueprint';
import SessionValidation from '@/pages/student/SessionValidation';
import SessionReflection from '@/pages/student/SessionReflection';
import SessionReport from '@/pages/student/SessionReport';
import GuidedLearning from '@/pages/student/GuidedLearning';
import Portfolio from '@/pages/student/Portfolio';
import Reports from '@/pages/student/Reports';
import AIMentor from '@/pages/student/AIMentor';
import Achievements from '@/pages/student/Achievements';
import StudentSettings from '@/pages/student/Settings';

import FacultyDashboard from '@/pages/faculty/Dashboard';
import CourseIntelligence from '@/pages/faculty/CourseIntelligence';
import StudentIntelligence from '@/pages/faculty/StudentIntelligence';
import TeachingInsights from '@/pages/faculty/TeachingInsights';
import InterventionPlanner from '@/pages/faculty/InterventionPlanner';
import ImpactAnalytics from '@/pages/faculty/ImpactAnalytics';

import InstitutionDashboard from '@/pages/institution/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout><LandingPage /></PublicLayout>,
  },
  {
    path: '/about',
    element: <PublicLayout><AboutPage /></PublicLayout>,
  },
  {
    path: '/features',
    element: <PublicLayout><FeaturesPage /></PublicLayout>,
  },
  {
    path: '/contact',
    element: <PublicLayout><ContactPage /></PublicLayout>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/student',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><Navigate to="/student/dashboard" replace /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/dashboard',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><StudentDashboard /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/new',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><CreateLearningSession /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/:sessionId',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><SessionAnalysis /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/:sessionId/analysis',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><SessionAnalysis /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/:sessionId/blueprint',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><SessionBlueprint /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/:sessionId/validation',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><SessionValidation /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/:sessionId/reflection',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><SessionReflection /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/:sessionId/report',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><SessionReport /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/learning/:sessionId/guided-learning',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><GuidedLearning /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/portfolio',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><Portfolio /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/reports',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><Reports /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/mentor',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><AIMentor /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/achievements',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><Achievements /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/student/settings',
    element: <AuthGuard><RoleGuard allowedRoles={['student']}><StudentLayout><StudentSettings /></StudentLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><Navigate to="/faculty/dashboard" replace /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/dashboard',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><FacultyDashboard /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/courses',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><CourseIntelligence /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/courses/:courseId',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><CourseIntelligence /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/students/:studentId',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><StudentIntelligence /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/analytics',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><TeachingInsights /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/interventions',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><InterventionPlanner /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/reports',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><ImpactAnalytics /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/faculty/settings',
    element: <AuthGuard><RoleGuard allowedRoles={['faculty']}><FacultyLayout><StudentSettings /></FacultyLayout></RoleGuard></AuthGuard>,
  },
  {
    path: '/institution/dashboard',
    element: <AuthGuard><RoleGuard allowedRoles={['institution']}><InstitutionDashboard /></RoleGuard></AuthGuard>,
  },
]);

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'faculty' | 'institution' | 'admin';
  avatar?: string;
  institution?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setTokens: (token: string, refreshToken: string) => void;
  updateUser: (user: Partial<User>) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'faculty';
  institution?: string;
  department?: string;
}

export interface LearningSession {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  assignmentContent: string;
  learningObjective: string;
  status: 'uploading' | 'analyzing' | 'blueprint_ready' | 'validating' | 'reflecting' | 'completed' | 'failed';
  blueprint?: Blueprint;
  validation?: Validation;
  reflection?: Reflection;
  report?: Report;
  aiConfig: AIConfig;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AIConfig {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  timeEstimate: number;
  adaptiveDifficulty: boolean;
}

export interface Blueprint {
  id: string;
  sessionId: string;
  concepts: Concept[];
  learningObjectives: string[];
  difficulty: string;
  estimatedTime: number;
  conceptGraph: ConceptGraph;
  createdAt: string;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  prerequisites: string[];
  mastery: number;
  status: 'discovered' | 'learning' | 'validated' | 'mastered';
  relatedTopics: string[];
}

export interface ConceptGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  group: number;
  size: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface Validation {
  id: string;
  sessionId: string;
  questions: ValidationQuestion[];
  currentQuestionIndex: number;
  responses: ValidationResponse[];
  conceptScores: Record<string, ConceptScore>;
  overallScore: number;
  confidence: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface ValidationQuestion {
  id: string;
  conceptId: string;
  conceptName: string;
  question: string;
  type: 'multiple_choice' | 'short_answer' | 'code' | 'diagram';
  options?: string[];
  correctAnswer?: string;
  difficulty: number;
  timeLimit?: number;
}

export interface ValidationResponse {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeSpent: number;
  confidence: number;
  conceptId: string;
}

export interface ConceptScore {
  conceptId: string;
  conceptName: string;
  score: number;
  confidence: number;
  attempts: number;
  correctAttempts: number;
  timeSpent: number;
}

export interface Reflection {
  id: string;
  sessionId: string;
  sections: ReflectionSection[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReflectionSection {
  id: string;
  title: string;
  content: string;
  placeholder: string;
  isCompleted: boolean;
}

export interface Report {
  id: string;
  sessionId: string;
  authenticityScore: number;
  conceptMastery: ConceptMasteryReport;
  confidenceAnalysis: ConfidenceAnalysis;
  timeline: ReportTimeline;
  strengths: string[];
  recommendations: string[];
  aiInsights: string;
  generatedAt: string;
}

export interface ConceptMasteryReport {
  overall: number;
  byConcept: Record<string, {
    name: string;
    score: number;
    confidence: number;
    level: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
  }>;
}

export interface ConfidenceAnalysis {
  overall: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  dataPoints: { time: string; value: number }[];
}

export interface ReportTimeline {
  stages: TimelineStage[];
  totalTime: number;
}

export interface TimelineStage {
  name: string;
  startedAt: string;
  completedAt: string;
  duration: number;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface Recommendation {
  id: string;
  type: 'concept_review' | 'practice' | 'resource' | 'study_group';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  conceptId?: string;
  conceptName?: string;
  resourceUrl?: string;
  estimatedTime: number;
  createdAt: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  learningDNA: LearningDNA;
  growthTimeline: GrowthTimelineEntry[];
  reflectionLibrary: ReflectionEntry[];
  achievements: Achievement[];
  analytics: PortfolioAnalytics;
}

export interface LearningDNA {
  primaryStyle: string;
  secondaryStyle: string;
  strengths: string[];
  growthAreas: string[];
  learningPatterns: LearningPattern[];
}

export interface LearningPattern {
  name: string;
  score: number;
  description: string;
}

export interface GrowthTimelineEntry {
  date: string;
  sessionId: string;
  sessionTitle: string;
  authenticityScore: number;
  conceptsMastered: number;
  milestone?: string;
}

export interface ReflectionEntry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  content: string;
  date: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'mastery' | 'consistency' | 'exploration' | 'social';
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface PortfolioAnalytics {
  totalSessions: number;
  averageAuthenticity: number;
  conceptsMastered: number;
  totalReflections: number;
  currentStreak: number;
  longestStreak: number;
  weeklyData: WeeklyData[];
}

export interface WeeklyData {
  week: string;
  sessions: number;
  authenticity: number;
  concepts: number;
}

export interface DashboardData {
  recentSessions: LearningSession[];
  metrics: DashboardMetrics;
  recommendations: Recommendation[];
  achievements: Achievement[];
  weeklyProgress: WeeklyData[];
}

export interface DashboardMetrics {
  learningAuthenticity: number;
  conceptMastery: number;
  confidenceIndex: number;
  aiLearningBalance: number;
  weeklyProgress: number;
  learningStreak: number;
}

export interface FacultyDashboard {
  activeSessions: number;
  totalStudents: number;
  averageAuthenticity: number;
  studentConfidence: number;
  conceptHeatmap: ConceptHeatmapData[];
  recentActivity: FacultyActivity[];
  interventions: Intervention[];
}

export interface ConceptHeatmapData {
  concept: string;
  course: string;
  averageMastery: number;
  studentCount: number;
  difficulty: number;
}

export interface FacultyActivity {
  id: string;
  type: string;
  description: string;
  studentName: string;
  timestamp: string;
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  targetStudents: string[];
  targetConcepts: string[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  semester: string;
  studentCount: number;
  averageAuthenticity: number;
  conceptMastery: number;
  createdAt: string;
}

export interface Faculty {
  id: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  courses: Course[];
  stats: FacultyStats;
}

export interface FacultyStats {
  totalStudents: number;
  activeCourses: number;
  averageClassPerformance: number;
  interventionCount: number;
}

export interface InstitutionDashboard {
  overview: InstitutionOverview;
  departments: DepartmentPerformance[];
  learningTrends: LearningTrend[];
  facultyEngagement: FacultyEngagement[];
}

export interface InstitutionOverview {
  totalStudents: number;
  totalFaculty: number;
  activeCourses: number;
  averageAuthenticity: number;
  totalSessions: number;
}

export interface DepartmentPerformance {
  department: string;
  students: number;
  averageAuthenticity: number;
  conceptMastery: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface LearningTrend {
  month: string;
  authenticity: number;
  engagement: number;
  mastery: number;
}

export interface FacultyEngagement {
  name: string;
  department: string;
  activeCourses: number;
  studentSatisfaction: number;
  interventionRate: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export type UserRole = "student" | "faculty" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface SessionState {
  step: number;
  course: string;
  topic: string;
  focusArea: string;
  files: string[];
  companion: string;
  cognitiveLevel: string;
  learningObjective: string;
  assignmentDetails: string;
  currentRoute?: string;
}

export interface AnalysisStep {
  num: number;
  name: string;
  desc: string;
}

export interface Concept {
  id: string;
  name: string;
  mastery: number;
  status: "pending" | "learning" | "strong" | "mastered";
}

export interface ValidationResponse {
  conceptId: string;
  response: string;
  confidence: number;
  timestamp: number;
}

export interface ReflectionNote {
  id: string;
  concept: string;
  summary: string;
  notes: string;
  bookmarked: boolean;
  timestamp: number;
}

export interface LearningMetrics {
  authenticity: number;
  confidence: number;
  conceptMastery: number;
  aiBalance: number;
  originalThoughtRatio: number;
  timeSpent: number;
  hintsUsed: number;
  aiSuggestionsApplied: number;
}

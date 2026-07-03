"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, SessionState, LearningMetrics, ValidationResponse, ReflectionNote, Concept } from "./types";
import { ANALYSIS_STEPS, MOCK_STUDENT } from "./constants";

interface AppState {
  user: User | null;
  session: SessionState | null;
  metrics: LearningMetrics | null;
  validations: ValidationResponse[];
  reflections: ReflectionNote[];
  concepts: Concept[];
  analysisProgress: number;
  analysisComplete: boolean;
  notifications: string[];
}

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setSession: (session: SessionState | null) => void;
  updateSession: (partial: Partial<SessionState>) => void;
  setMetrics: (metrics: LearningMetrics) => void;
  addValidation: (v: ValidationResponse) => void;
  addReflection: (r: ReflectionNote) => void;
  toggleBookmark: (id: string) => void;
  updateConcept: (id: string, partial: Partial<Concept>) => void;
  advanceAnalysis: () => void;
  resetAnalysis: () => void;
  addNotification: (msg: string) => void;
  dismissNotification: (idx: number) => void;
  clearSession: () => void;
}

const defaultSession: SessionState = {
  step: 1,
  course: "",
  topic: "",
  focusArea: "",
  files: [],
  companion: "socratic",
  cognitiveLevel: "deep",
  learningObjective: "",
  assignmentDetails: "",
};

const defaultMetrics: LearningMetrics = {
  authenticity: 94,
  confidence: 88,
  conceptMastery: 72,
  aiBalance: 94,
  originalThoughtRatio: 92,
  timeSpent: 45,
  hintsUsed: 1,
  aiSuggestionsApplied: 3,
};

const defaultConcepts: Concept[] = [
  { id: "c1", name: "Object-Oriented Prog.", mastery: 92, status: "strong" },
  { id: "c2", name: "Inheritance", mastery: 40, status: "learning" },
  { id: "c3", name: "Polymorphism", mastery: 10, status: "pending" },
  { id: "c4", name: "Encapsulation", mastery: 78, status: "strong" },
  { id: "c5", name: "Abstraction", mastery: 55, status: "learning" },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: MOCK_STUDENT,
    session: null,
    metrics: defaultMetrics,
    validations: [],
    reflections: [],
    concepts: defaultConcepts,
    analysisProgress: 0,
    analysisComplete: false,
    notifications: [],
  });

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("lens_user");
      const storedSession = localStorage.getItem("lens_session");
      const storedReflections = localStorage.getItem("lens_reflections");
      const storedValidations = localStorage.getItem("lens_validations");

      setState((s) => ({
        ...s,
        user: storedUser ? JSON.parse(storedUser) : MOCK_STUDENT,
        session: storedSession ? JSON.parse(storedSession) : null,
        reflections: storedReflections ? JSON.parse(storedReflections) : [],
        validations: storedValidations ? JSON.parse(storedValidations) : [],
      }));
    }
  }, []);

  // Sync state to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (state.user) {
        localStorage.setItem("lens_user", JSON.stringify(state.user));
      } else {
        localStorage.removeItem("lens_user");
      }
    }
  }, [state.user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (state.session) {
        localStorage.setItem("lens_session", JSON.stringify(state.session));
      } else {
        localStorage.removeItem("lens_session");
      }
    }
  }, [state.session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lens_reflections", JSON.stringify(state.reflections));
    }
  }, [state.reflections]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (state.validations && state.validations.length > 0) {
        localStorage.setItem("lens_validations", JSON.stringify(state.validations));
      } else {
        localStorage.removeItem("lens_validations");
      }
    }
  }, [state.validations]);

  const setUser = useCallback((user: User | null) => {
    setState((s) => ({ ...s, user }));
  }, []);

  const setSession = useCallback((session: SessionState | null) => {
    setState((s) => ({ ...s, session }));
  }, []);

  const updateSession = useCallback((partial: Partial<SessionState>) => {
    setState((s) => ({
      ...s,
      session: s.session ? { ...s.session, ...partial } : { ...defaultSession, ...partial },
    }));
  }, []);

  const setMetrics = useCallback((metrics: LearningMetrics) => {
    setState((s) => ({ ...s, metrics }));
  }, []);

  const addValidation = useCallback((v: ValidationResponse) => {
    setState((s) => ({ ...s, validations: [...s.validations, v] }));
  }, []);

  const addReflection = useCallback((r: ReflectionNote) => {
    setState((s) => ({ ...s, reflections: [...s.reflections, r] }));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      reflections: s.reflections.map((r) =>
        r.id === id ? { ...r, bookmarked: !r.bookmarked } : r
      ),
    }));
  }, []);

  const updateConcept = useCallback((id: string, partial: Partial<Concept>) => {
    setState((s) => ({
      ...s,
      concepts: s.concepts.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    }));
  }, []);

  const advanceAnalysis = useCallback(() => {
    setState((s) => {
      const next = s.analysisProgress + 1;
      const complete = next >= ANALYSIS_STEPS.length;
      return { ...s, analysisProgress: next, analysisComplete: complete };
    });
  }, []);

  const resetAnalysis = useCallback(() => {
    setState((s) => ({ ...s, analysisProgress: 0, analysisComplete: false }));
  }, []);

  const addNotification = useCallback((msg: string) => {
    setState((s) => ({ ...s, notifications: [...s.notifications, msg] }));
    setTimeout(() => {
      setState((s) => ({ ...s, notifications: s.notifications.slice(1) }));
    }, 4000);
  }, []);

  const dismissNotification = useCallback((idx: number) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.filter((_, i) => i !== idx),
    }));
  }, []);

  const clearSession = useCallback(() => {
    setState((s) => ({ ...s, session: null, validations: [], analysisProgress: 0, analysisComplete: false }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser,
        setSession,
        updateSession,
        setMetrics,
        addValidation,
        addReflection,
        toggleBookmark,
        updateConcept,
        advanceAnalysis,
        resetAnalysis,
        addNotification,
        dismissNotification,
        clearSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}

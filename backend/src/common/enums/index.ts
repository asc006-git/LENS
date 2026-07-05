export enum UserRole {
  STUDENT = 'student',
  FACULTY = 'faculty',
  INSTITUTION_ADMIN = 'institution_admin',
  SYSTEM_ADMIN = 'system_admin',
}

export enum SessionStatus {
  CREATED = 'created',
  CONFIGURED = 'configured',
  UPLOADING = 'uploading',
  ANALYZING = 'analyzing',
  ANALYSIS_FAILED = 'analysis_failed',
  BLUEPRINT_GENERATED = 'blueprint_generated',
  BLUEPRINT_CONFIRMED = 'blueprint_confirmed',
  VALIDATING = 'validating',
  VALIDATING_COMPLETED = 'validating_completed',
  REFLECTION_SAVED = 'reflection_saved',
  REPORT_GENERATED = 'report_generated',
  GUIDED_LEARNING = 'guided_learning',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  ASSIGNMENT_MISMATCH = 'assignment_mismatch',
}

export enum ValidationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export enum AIModule {
  ANALYSIS = 'analysis',
  BLUEPRINT = 'blueprint',
  VALIDATION = 'validation',
  REFLECTION = 'reflection',
  RECOMMENDATION = 'recommendation',
  REPORT = 'report',
}

export enum BloomLevel {
  REMEMBER = 'remember',
  UNDERSTAND = 'understand',
  APPLY = 'apply',
  ANALYZE = 'analyze',
  EVALUATE = 'evaluate',
  CREATE = 'create',
}

export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
}

export enum ActivityType {
  VIDEO = 'video',
  READING = 'reading',
  PRACTICE = 'practice',
  QUIZ = 'quiz',
  INTERACTIVE = 'interactive',
  PROJECT = 'project',
}

export enum NotificationType {
  SESSION_UPDATE = 'session_update',
  ACHIEVEMENT = 'achievement',
  RECOMMENDATION = 'recommendation',
  REPORT_READY = 'report_ready',
  FACULTY_MESSAGE = 'faculty_message',
  SYSTEM = 'system',
}

export enum FileUploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

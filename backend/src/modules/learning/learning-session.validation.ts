import { z } from 'zod';
import { SessionStatus } from '../../common/enums';

export const createSessionSchema = z.object({
  course: z.string().optional(),
  assignment: z.string().optional(),
  learningObjective: z.string().max(500).optional(),
});

export const uploadFilesSchema = z.object({
  files: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    size: z.number().positive(),
    type: z.string(),
  })).min(1),
});

export const confirmBlueprintSchema = z.object({
  concepts: z.array(z.object({
    name: z.string(),
    description: z.string(),
    weight: z.number().min(0).max(1),
    order: z.number(),
  })).optional(),
  learningGoals: z.array(z.string()).optional(),
  dependencies: z.record(z.array(z.string())).optional(),
  estimatedTime: z.number().positive().optional(),
  difficulty: z.string().optional(),
});

export const submitValidationResponseSchema = z.object({
  concept: z.string().min(1),
  question: z.string().min(1),
  response: z.string().min(1),
  understanding: z.string().min(1),
  confidence: z.number().min(0).max(1),
  hints: z.array(z.string()).optional().default([]),
});

export const generateReflectionSchema = z.object({
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    type: z.string(),
  })),
  studentEdits: z.record(z.string()).optional().default({}),
});

export const resumeSessionSchema = z.object({
  deviceInfo: z.string().optional().default(''),
});

export const getSessionsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  status: z.nativeEnum(SessionStatus).optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type ConfirmBlueprintInput = z.infer<typeof confirmBlueprintSchema>;
export type SubmitValidationResponseInput = z.infer<typeof submitValidationResponseSchema>;
export type GenerateReflectionInput = z.infer<typeof generateReflectionSchema>;

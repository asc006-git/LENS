import mongoose from 'mongoose';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface IAuthRequest extends Express.Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    email: string;
    role: string;
    name: string;
  };
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export interface IUploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface IAiConcept {
  name: string;
  difficulty: number;
  bloomLevel: string;
  prerequisites: string[];
}

export interface IValidationResponse {
  concept: string;
  question: string;
  response: string;
  understanding: string;
  confidence: number;
  hints: string[];
}

export interface IReflectionSection {
  title: string;
  content: string;
  type: string;
}

export interface IGuidedActivity {
  type: string;
  concept: string;
  description: string;
  completed: boolean;
}

export interface ISessionState {
  currentStage: string;
  completionPercentage: number;
  lastActiveTime: Date;
  resumePoint: string;
  deviceInfo: string;
}

import mongoose, { Schema, Document } from 'mongoose';

export interface IAiDebugLog extends Document {
  sessionId: string;
  module: string;
  prompt: string;
  responseText: string;
  aiModel: string;
  duration: number;
  tokensUsed?: { prompt: number; completion: number };
  error?: string;
  createdAt: Date;
}

const aiDebugLogSchema = new Schema<IAiDebugLog>({
  sessionId: { type: String, required: true, index: true },
  module: { type: String, required: true, index: true },
  prompt: { type: String, required: true },
  responseText: { type: String, default: '' },
  aiModel: { type: String, required: true },
  duration: { type: Number, required: true },
  tokensUsed: {
    prompt: { type: Number },
    completion: { type: Number },
  },
  error: { type: String },
  createdAt: { type: Date, default: Date.now, index: { expireAfterSeconds: 604800 } },
});

export const AiDebugLog = mongoose.model<IAiDebugLog>('AiDebugLog', aiDebugLogSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { SessionStatus, ValidationStatus } from '../../common/enums';

export interface ILearningSession extends Document {
  student: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  assignment?: mongoose.Types.ObjectId;
  status: SessionStatus;
  learningObjective?: string;
  uploadedFiles: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: Date;
  }>;
  aiAnalysis: {
    concepts: Array<{
      name: string;
      difficulty: number;
      bloomLevel: string;
      prerequisites: string[];
    }>;
    topicClassification: string;
    difficultyEstimate: number;
    learningObjectives: string[];
    generatedAt?: Date;
  };
  blueprint: {
    concepts: Array<{
      name: string;
      description: string;
      weight: number;
      order: number;
    }>;
    learningGoals: string[];
    dependencies: Record<string, string[]>;
    estimatedTime: number;
    difficulty: string;
    confirmed: boolean;
    confirmedAt?: Date;
  };
  validation: {
    startedAt?: Date;
    completedAt?: Date;
    responses: Array<{
      concept: string;
      question: string;
      response: string;
      understanding: string;
      confidence: number;
      hints: string[];
    }>;
    overallConfidence: number;
    overallUnderstanding: string;
  };
  reflection: {
    generatedAt?: Date;
    sections: Array<{
      title: string;
      content: string;
      type: string;
    }>;
    studentEdits: Record<string, string>;
    aiGenerated: boolean;
  };
  report: {
    generatedAt?: Date;
    learningAuthenticity: number;
    confidenceIndex: number;
    conceptMastery: Record<string, number>;
    aiLearningBalance: {
      aiAssisted: number;
      selfDirected: number;
    };
    strengths: string[];
    growthOpportunities: string[];
    recommendations: string[];
  };
  guidedLearning: {
    activities: Array<{
      type: string;
      concept: string;
      description: string;
      completed: boolean;
    }>;
    roadmap: string[];
  };
  sessionState: {
    currentStage: string;
    completionPercentage: number;
    lastActiveTime: Date;
    resumePoint: string;
    deviceInfo: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const learningSessionSchema = new Schema<ILearningSession>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    assignment: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.CREATED,
    },
    learningObjective: {
      type: String,
      trim: true,
    },
    uploadedFiles: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number, required: true },
        type: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    aiAnalysis: {
      concepts: [
        {
          name: { type: String },
          difficulty: { type: Number },
          bloomLevel: { type: String },
          prerequisites: [{ type: String }],
        },
      ],
      topicClassification: { type: String },
      difficultyEstimate: { type: Number },
      learningObjectives: [{ type: String }],
      generatedAt: { type: Date },
    },
    blueprint: {
      concepts: [
        {
          name: { type: String },
          description: { type: String },
          weight: { type: Number },
          order: { type: Number },
        },
      ],
      learningGoals: [{ type: String }],
      dependencies: { type: Schema.Types.Mixed },
      estimatedTime: { type: Number },
      difficulty: { type: String },
      confirmed: { type: Boolean, default: false },
      confirmedAt: { type: Date },
    },
    validation: {
      startedAt: { type: Date },
      completedAt: { type: Date },
      responses: [
        {
          concept: { type: String },
          question: { type: String },
          response: { type: String },
          understanding: { type: String },
          confidence: { type: Number },
          hints: [{ type: String }],
        },
      ],
      overallConfidence: { type: Number, default: 0 },
      overallUnderstanding: { type: String, default: '' },
    },
    reflection: {
      generatedAt: { type: Date },
      sections: [
        {
          title: { type: String },
          content: { type: String },
          type: { type: String },
        },
      ],
      studentEdits: { type: Schema.Types.Mixed, default: {} },
      aiGenerated: { type: Boolean, default: false },
    },
    report: {
      generatedAt: { type: Date },
      learningAuthenticity: { type: Number, default: 0 },
      confidenceIndex: { type: Number, default: 0 },
      conceptMastery: { type: Schema.Types.Mixed, default: {} },
      aiLearningBalance: {
        aiAssisted: { type: Number, default: 0 },
        selfDirected: { type: Number, default: 0 },
      },
      strengths: [{ type: String }],
      growthOpportunities: [{ type: String }],
      recommendations: [{ type: String }],
    },
    guidedLearning: {
      activities: [
        {
          type: { type: String },
          concept: { type: String },
          description: { type: String },
          completed: { type: Boolean, default: false },
        },
      ],
      roadmap: [{ type: String }],
    },
    sessionState: {
      currentStage: { type: String, default: SessionStatus.CREATED },
      completionPercentage: { type: Number, default: 0 },
      lastActiveTime: { type: Date, default: Date.now },
      resumePoint: { type: String },
      deviceInfo: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

learningSessionSchema.index({ student: 1, status: 1 });
learningSessionSchema.index({ student: 1, createdAt: -1 });
learningSessionSchema.index({ course: 1 });
learningSessionSchema.index({ status: 1 });
learningSessionSchema.index({ 'sessionState.lastActiveTime': -1 });

const LearningSession = mongoose.model<ILearningSession>('LearningSession', learningSessionSchema);

export default LearningSession;

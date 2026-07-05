import LearningSession, { ILearningSession } from './learning-session.model';
import { SessionStatus } from '../../common/enums';
import { NotFoundError, AppError } from '../../common/errors';
import { DocumentAnalysisService } from './document-analysis.service';
import BlueprintService from '../blueprint/blueprint.service';
import Assignment from '../course/assignment.model';
import { AiDebugLog } from '../../ai/models/ai-debug-log.model';
import logger from '../../common/utils/logger';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const BLUEPRINT_TIMEOUT_MS = 60000;

export class LearningSessionService {
  static async createSession(studentId: string, data: { course?: string; assignment?: string; learningObjective?: string }): Promise<ILearningSession> {
    const session = await LearningSession.create({
      student: new mongoose.Types.ObjectId(studentId),
      course: data.course ? new mongoose.Types.ObjectId(data.course) : undefined,
      assignment: data.assignment ? new mongoose.Types.ObjectId(data.assignment) : undefined,
      learningObjective: data.learningObjective,
      status: SessionStatus.CREATED,
      sessionState: {
        currentStage: SessionStatus.CREATED,
        completionPercentage: 0,
        lastActiveTime: new Date(),
        resumePoint: '',
        deviceInfo: '',
      },
    });

    return session;
  }

  static async uploadFiles(sessionId: string, studentId: string, files: Express.Multer.File[]): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    for (const file of files) {
      const stored = await DocumentAnalysisService.storeFile(sessionId, file);
      session.uploadedFiles.push({
        name: stored.filename,
        url: stored.filePath,
        size: stored.size,
        type: stored.mimetype,
        uploadedAt: new Date(),
      });
    }

    session.status = SessionStatus.UPLOADING;
    session.sessionState.currentStage = SessionStatus.UPLOADING;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async startAnalysis(sessionId: string, studentId: string): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    if (session.uploadedFiles.length === 0) {
      throw new AppError('No files uploaded for analysis', 400, 'NO_FILES');
    }

    session.status = SessionStatus.ANALYZING;
    session.sessionState.currentStage = SessionStatus.ANALYZING;
    session.sessionState.lastActiveTime = new Date();

    await session.save();

    try {
      const course = session.course ? session.course.toString() : undefined;
      const assignment = session.assignment ? session.assignment.toString() : undefined;

      const priorWeakConcepts = await DocumentAnalysisService.extractPriorWeakConcepts(studentId);

      let extractedText = '';

      for (const file of session.uploadedFiles) {
        if (fs.existsSync(file.url)) {
          const text = await DocumentAnalysisService.extractText(file.url, file.type);
          extractedText += `\n\n--- FILE: ${file.name} ---\n\n${text}`;
        }
      }

      if (!extractedText.trim()) {
        throw new AppError('Could not extract any text from uploaded files', 400, 'NO_TEXT_EXTRACTED');
      }

      const analysisResult = await DocumentAnalysisService.analyzeDocument(sessionId, extractedText, {
        course,
        assignment,
        priorWeakConcepts,
      });

      session.aiAnalysis = {
        concepts: analysisResult.concepts.map(c => ({
          name: c.name,
          difficulty: c.difficulty === 'easy' ? 0.3 : c.difficulty === 'hard' ? 0.8 : 0.5,
          bloomLevel: c.bloomLevel || 'understand',
          prerequisites: [],
        })),
        topicClassification: analysisResult.summary.slice(0, 200),
        difficultyEstimate: analysisResult.concepts.reduce((acc, c) => {
          return acc + (c.difficulty === 'easy' ? 0.3 : c.difficulty === 'hard' ? 0.8 : 0.5);
        }, 0) / Math.max(analysisResult.concepts.length, 1),
        learningObjectives: analysisResult.learningObjectives,
        generatedAt: new Date(),
      };

      await session.save();

      const sessionContext = await this.getStudentSessionContext(studentId, sessionId);

      let facultyExpectations: any = undefined;
      let contextTier: 'full' | 'partial' | 'document-only' = 'document-only';
      const contextDetails: Record<string, any> = {};

      if (session.assignment) {
        const assignmentDoc = await Assignment.findById(session.assignment);
        if (assignmentDoc) {
          const hasFaculty = assignmentDoc.expectedConcepts?.length || assignmentDoc.rubricCriteria?.length
            || assignmentDoc.learningObjectives?.length || assignmentDoc.facultyNotes;
          if (hasFaculty) {
            facultyExpectations = {
              expectedConcepts: assignmentDoc.expectedConcepts,
              rubricCriteria: assignmentDoc.rubricCriteria,
              learningObjectives: assignmentDoc.learningObjectives,
              facultyNotes: assignmentDoc.facultyNotes,
            };
            contextDetails.hasFacultyExpectations = true;
          }
        }
      }

      if (facultyExpectations && session.course && sessionContext.hasPriorSessions) {
        contextTier = 'full';
      } else if (session.course || sessionContext.hasPriorSessions) {
        contextTier = 'partial';
      }
      contextDetails.courseLinked = !!session.course;
      contextDetails.hasPriorSessions = sessionContext.hasPriorSessions;
      await this.logContextTier(sessionId, contextTier, contextDetails);

      const humanEffort = await DocumentAnalysisService.evaluateHumanEffort(sessionId, extractedText);

      const result = await BlueprintService.generateBlueprintFromAnalysis(sessionId, studentId, analysisResult, facultyExpectations);

      session.status = SessionStatus.BLUEPRINT_GENERATED;
      session.sessionState.currentStage = SessionStatus.BLUEPRINT_GENERATED;
      session.sessionState.completionPercentage = 30;
      session.sessionState.lastActiveTime = new Date();

      await session.save();

      (session.aiAnalysis as any).writingFlowNote = analysisResult.writingFlowNote;
      (session as any).humanEffort = humanEffort;
      await session.save();

      return session;
    } catch (error: any) {
      const errorMessage = error instanceof AppError ? error.message : `Analysis failed: ${error.message}`;
      session.status = SessionStatus.ANALYSIS_FAILED;
      session.sessionState.currentStage = SessionStatus.ANALYSIS_FAILED;
      session.sessionState.lastActiveTime = new Date();
      session.errorMessage = errorMessage;
      await session.save();

      if (error instanceof AppError) throw error;
      throw new AppError(errorMessage, 500, 'ANALYSIS_FAILED');
    }
  }

  static async runFullAnalysisPipeline(
    sessionId: string,
    studentId: string,
    files: Express.Multer.File[]
  ): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    if (files && files.length > 0 && session.uploadedFiles.length === 0) {
      for (const file of files) {
        const stored = await DocumentAnalysisService.storeFile(sessionId, file);
        session.uploadedFiles.push({
          name: stored.filename,
          url: stored.filePath,
          size: stored.size,
          type: stored.mimetype,
          uploadedAt: new Date(),
        });
      }
    }

    session.status = SessionStatus.ANALYZING;
    session.sessionState.currentStage = SessionStatus.ANALYZING;
    session.sessionState.lastActiveTime = new Date();
    await session.save();

    try {
      const course = session.course ? session.course.toString() : undefined;
      const assignment = session.assignment ? session.assignment.toString() : undefined;

      const priorWeakConcepts = await DocumentAnalysisService.extractPriorWeakConcepts(studentId);

      let extractedText = '';
      for (const file of session.uploadedFiles) {
        if (fs.existsSync(file.url)) {
          const text = await DocumentAnalysisService.extractText(file.url, file.type);
          extractedText += `\n\n--- FILE: ${file.name} ---\n\n${text}`;
        }
      }

      if (!extractedText.trim()) {
        throw new AppError('Could not extract any text from uploaded files', 400, 'NO_TEXT_EXTRACTED');
      }

      // --- Assignment Alignment Check ---
      if (session.assignment) {
        const assignmentDoc = await Assignment.findById(session.assignment);
        if (assignmentDoc) {
          const alignmentResult = await DocumentAnalysisService.checkAssignmentAlignment(
            sessionId, extractedText, {
              title: assignmentDoc.title,
              description: assignmentDoc.description,
              expectedConcepts: assignmentDoc.expectedConcepts,
              learningObjectives: assignmentDoc.learningObjectives,
            }
          );

          if (!alignmentResult.aligned && alignmentResult.confidence >= 0.7) {
            session.status = SessionStatus.ASSIGNMENT_MISMATCH;
            session.sessionState.currentStage = SessionStatus.ASSIGNMENT_MISMATCH;
            session.sessionState.completionPercentage = 10;
            session.assignmentMismatchReason = alignmentResult.reason;
            await session.save();
            return session;
          }
        }
      }

      const analysisResult = await DocumentAnalysisService.analyzeDocument(sessionId, extractedText, {
        course,
        assignment,
        priorWeakConcepts,
      });

      session.aiAnalysis = {
        concepts: analysisResult.concepts.map(c => ({
          name: c.name,
          difficulty: c.difficulty === 'easy' ? 0.3 : c.difficulty === 'hard' ? 0.8 : 0.5,
          bloomLevel: c.bloomLevel || 'understand',
          prerequisites: [],
        })),
        topicClassification: analysisResult.summary.slice(0, 200),
        difficultyEstimate: analysisResult.concepts.reduce((acc, c) => {
          return acc + (c.difficulty === 'easy' ? 0.3 : c.difficulty === 'hard' ? 0.8 : 0.5);
        }, 0) / Math.max(analysisResult.concepts.length, 1),
        learningObjectives: analysisResult.learningObjectives,
        generatedAt: new Date(),
      };

      await session.save();

      const sessionContext = await this.getStudentSessionContext(studentId, sessionId);

      let facultyExpectations: any = undefined;
      let contextTier: 'full' | 'partial' | 'document-only' = 'document-only';
      const contextDetails: Record<string, any> = {};

      if (session.assignment) {
        const assignmentDoc = await Assignment.findById(session.assignment);
        if (assignmentDoc) {
          const hasFaculty = assignmentDoc.expectedConcepts?.length || assignmentDoc.rubricCriteria?.length
            || assignmentDoc.learningObjectives?.length || assignmentDoc.facultyNotes;
          if (hasFaculty) {
            facultyExpectations = {
              expectedConcepts: assignmentDoc.expectedConcepts,
              rubricCriteria: assignmentDoc.rubricCriteria,
              learningObjectives: assignmentDoc.learningObjectives,
              facultyNotes: assignmentDoc.facultyNotes,
            };
            contextDetails.hasFacultyExpectations = true;
          }
        }
      }

      if (facultyExpectations && session.course && sessionContext.hasPriorSessions) {
        contextTier = 'full';
      } else if (session.course || sessionContext.hasPriorSessions) {
        contextTier = 'partial';
      }
      contextDetails.courseLinked = !!session.course;
      contextDetails.hasPriorSessions = sessionContext.hasPriorSessions;
      await this.logContextTier(sessionId, contextTier, contextDetails);

      const humanEffort = await DocumentAnalysisService.evaluateHumanEffort(sessionId, extractedText);

      const result = await this.withTimeout(
        BlueprintService.generateBlueprintFromAnalysis(sessionId, studentId, analysisResult, facultyExpectations),
        BLUEPRINT_TIMEOUT_MS,
        'Blueprint generation timed out after 60s'
      );

      session.status = SessionStatus.BLUEPRINT_GENERATED;
      session.sessionState.currentStage = SessionStatus.BLUEPRINT_GENERATED;
      session.sessionState.completionPercentage = 30;
      session.sessionState.lastActiveTime = new Date();

      await session.save();

      (session.aiAnalysis as any).writingFlowNote = analysisResult.writingFlowNote;
      (session as any).humanEffort = humanEffort;
      await session.save();

      return session;
    } catch (error: any) {
      const errorMessage = error instanceof AppError ? error.message : `Analysis failed: ${error.message}`;
      session.status = SessionStatus.ANALYSIS_FAILED;
      session.sessionState.currentStage = SessionStatus.ANALYSIS_FAILED;
      session.sessionState.lastActiveTime = new Date();
      session.errorMessage = errorMessage;
      await session.save();

      if (error instanceof AppError) throw error;
      throw new AppError(errorMessage, 500, 'ANALYSIS_FAILED');
    }
  }

  static async updateAnalysis(sessionId: string, analysisData: Partial<ILearningSession['aiAnalysis']>): Promise<ILearningSession> {
    const session = await LearningSession.findById(sessionId);
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    session.aiAnalysis = {
      ...session.aiAnalysis,
      ...analysisData,
      generatedAt: new Date(),
    };
    session.status = SessionStatus.BLUEPRINT_GENERATED;
    session.sessionState.currentStage = SessionStatus.BLUEPRINT_GENERATED;
    session.sessionState.completionPercentage = 30;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async getBlueprint(sessionId: string, studentId: string): Promise<ILearningSession> {
    return this.getSession(sessionId, studentId);
  }

  static async confirmBlueprint(sessionId: string, studentId: string, blueprintData: Partial<ILearningSession['blueprint']>): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.blueprint = {
      ...session.blueprint,
      ...blueprintData,
      confirmed: true,
      confirmedAt: new Date(),
    };
    session.status = SessionStatus.BLUEPRINT_CONFIRMED;
    session.sessionState.currentStage = SessionStatus.BLUEPRINT_CONFIRMED;
    session.sessionState.completionPercentage = 40;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async startValidation(sessionId: string, studentId: string): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.validation.startedAt = new Date();
    session.status = SessionStatus.VALIDATING;
    session.sessionState.currentStage = SessionStatus.VALIDATING;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async submitValidationResponse(
    sessionId: string,
    studentId: string,
    response: {
      concept: string;
      question: string;
      response: string;
      understanding: string;
      confidence: number;
      hints: string[];
    }
  ): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.validation.responses.push(response);

    const totalConfidence = session.validation.responses.reduce((sum, r) => sum + r.confidence, 0);
    session.validation.overallConfidence = totalConfidence / session.validation.responses.length;

    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async completeValidation(sessionId: string, studentId: string, overallUnderstanding: string): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.validation.completedAt = new Date();
    session.validation.overallUnderstanding = overallUnderstanding;
    session.status = SessionStatus.VALIDATING_COMPLETED;
    session.sessionState.currentStage = SessionStatus.VALIDATING_COMPLETED;
    session.sessionState.completionPercentage = 60;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async generateReflection(sessionId: string, studentId: string, reflectionData: Partial<ILearningSession['reflection']>): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.reflection = {
      ...session.reflection,
      ...reflectionData,
      generatedAt: new Date(),
      aiGenerated: true,
    };
    session.status = SessionStatus.REFLECTION_SAVED;
    session.sessionState.currentStage = SessionStatus.REFLECTION_SAVED;
    session.sessionState.completionPercentage = 75;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async generateReport(sessionId: string, studentId: string, reportData: Partial<ILearningSession['report']>): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.report = {
      ...session.report,
      ...reportData,
      generatedAt: new Date(),
    };
    session.status = SessionStatus.REPORT_GENERATED;
    session.sessionState.currentStage = SessionStatus.REPORT_GENERATED;
    session.sessionState.completionPercentage = 85;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async getSession(sessionId: string, studentId: string): Promise<ILearningSession> {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }
    return session;
  }

  static async getActiveSession(studentId: string): Promise<ILearningSession | null> {
    const session = await LearningSession.findOne({
      student: studentId,
      status: { $nin: [SessionStatus.COMPLETED, SessionStatus.ARCHIVED] },
    }).sort({ updatedAt: -1 });

    return session;
  }

  static async resumeSession(sessionId: string, studentId: string, deviceInfo: string): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.sessionState.lastActiveTime = new Date();
    session.sessionState.deviceInfo = deviceInfo;

    await session.save();
    return session;
  }

  static async completeSession(sessionId: string, studentId: string): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    session.status = SessionStatus.COMPLETED;
    session.sessionState.currentStage = SessionStatus.COMPLETED;
    session.sessionState.completionPercentage = 100;
    session.sessionState.lastActiveTime = new Date();

    await session.save();
    return session;
  }

  static async getStudentSessions(
    studentId: string,
    page: number = 1,
    limit: number = 10,
    status?: SessionStatus
  ): Promise<{ sessions: ILearningSession[]; total: number }> {
    const query: any = { student: studentId };
    if (status) {
      query.status = status;
    }

    const total = await LearningSession.countDocuments(query);
    const sessions = await LearningSession.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { sessions, total };
  }

  static async deleteSession(sessionId: string, studentId: string): Promise<void> {
    const session = await this.getSession(sessionId, studentId);
    await LearningSession.findByIdAndDelete(session._id);
  }

  private static withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new AppError(message, 408, 'TIMEOUT')), ms);
    });
    return Promise.race([promise, timeout]);
  }

  /**
   * Query last 5 completed sessions for cross-session context.
   * Returns concept mastery, confidence trends, and explanation patterns.
   */
  static async getStudentSessionContext(studentId: string, excludeSessionId?: string) {
    const query: any = {
      student: new mongoose.Types.ObjectId(studentId),
      status: { $in: [SessionStatus.COMPLETED, SessionStatus.REPORT_GENERATED, SessionStatus.GUIDED_LEARNING] },
    };
    if (excludeSessionId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeSessionId) };
    }

    const priorSessions = await LearningSession.find(query)
      .select('blueprint validation report')
      .sort({ updatedAt: -1 })
      .limit(5);

    const weakConcepts = new Set<string>();
    const conceptConsistency: Array<{ concept: string; priorTendency: string }> = [];
    let priorConfidenceSum = 0;
    let priorConfidenceCount = 0;

    for (const ps of priorSessions) {
      if (ps.report?.conceptMastery) {
        for (const [concept, mastery] of Object.entries(ps.report.conceptMastery)) {
          if ((mastery as number) < 0.6) weakConcepts.add(concept);
        }
      }
      if (ps.validation?.overallConfidence) {
        priorConfidenceSum += ps.validation.overallConfidence;
        priorConfidenceCount++;
      }
      if (ps.blueprint?.concepts) {
        for (const c of ps.blueprint.concepts) {
          const existing = conceptConsistency.find(cc => cc.concept === c.name);
          if (!existing) {
            conceptConsistency.push({ concept: c.name, priorTendency: 'mentioned' });
          }
        }
      }
    }

    const avgPriorConfidence = priorConfidenceCount > 0 ? priorConfidenceSum / priorConfidenceCount : 0;
    const confidenceTrend: 'improving' | 'declining' | 'stable' =
      avgPriorConfidence >= 0.7 ? 'improving' : avgPriorConfidence >= 0.4 ? 'stable' : 'declining';

    return {
      weakConcepts: Array.from(weakConcepts),
      conceptConsistency,
      confidenceTrend,
      hasPriorSessions: priorSessions.length > 0,
      priorSessionCount: priorSessions.length,
    };
  }

  /**
   * Log the context tier used for AI analysis to AiDebugLog.
   * full = assignment expectations + course context + document text + prior sessions
   * partial = some context missing
   * document-only = just the uploaded document text
   */
  private static async logContextTier(
    sessionId: string,
    tier: 'full' | 'partial' | 'document-only',
    details: Record<string, any> = {}
  ) {
    AiDebugLog.create({
      sessionId,
      module: 'context-tier',
      prompt: JSON.stringify({ tier, details }),
      responseText: '',
      aiModel: 'system',
      duration: 0,
    }).catch(() => {});
  }
}

export default LearningSessionService;

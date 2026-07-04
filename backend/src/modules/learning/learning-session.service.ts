import LearningSession, { ILearningSession } from './learning-session.model';
import { SessionStatus } from '../../common/enums';
import { NotFoundError, AppError } from '../../common/errors';
import mongoose from 'mongoose';

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

  static async uploadFiles(sessionId: string, studentId: string, files: Array<{ name: string; url: string; size: number; type: string }>): Promise<ILearningSession> {
    const session = await this.getSession(sessionId, studentId);

    const uploadedFiles = files.map((file) => ({
      ...file,
      uploadedAt: new Date(),
    }));

    session.uploadedFiles = [...session.uploadedFiles, ...uploadedFiles];
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
    return session;
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
}

export default LearningSessionService;

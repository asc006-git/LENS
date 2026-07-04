import LearningSession from '../learning/learning-session.model';
import { AIModule } from '../../common/enums';
import { AIProcessingError, NotFoundError } from '../../common/errors';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import PromptManager from '../../ai/prompts/prompt-manager';

export class ReportService {
  static async generateReport(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const prompt = PromptManager.createReportPrompt({
      concepts: session.blueprint.concepts,
      validationResponses: session.validation.responses,
      overallConfidence: session.validation.overallConfidence,
      reflection: session.reflection,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      const report = JSON.parse(response);

      session.report = {
        learningAuthenticity: report.learningAuthenticity || 0,
        confidenceIndex: report.confidenceIndex || 0,
        conceptMastery: report.conceptMastery || {},
        aiLearningBalance: report.aiLearningBalance || { aiAssisted: 0, selfDirected: 0 },
        strengths: report.strengths || [],
        growthOpportunities: report.growthOpportunities || [],
        recommendations: report.recommendations || [],
        generatedAt: new Date(),
      };

      await session.save();
      return session.report;
    } catch (error) {
      throw new AIProcessingError('Failed to generate report', AIModule.REPORT);
    }
  }

  static async getReport(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    return session.report;
  }

  static async exportReport(sessionId: string, studentId: string, format: string = 'pdf') {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    return {
      session: {
        id: session._id,
        learningObjective: session.learningObjective,
        status: session.status,
      },
      report: session.report,
      validation: session.validation,
      reflection: session.reflection,
      format,
      exportedAt: new Date(),
    };
  }

  static async shareReport(sessionId: string, studentId: string, shareWith: string[]) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    return {
      shareUrl: `/reports/shared/${session._id}`,
      sharedWith: shareWith,
      sharedAt: new Date(),
    };
  }
}

export default ReportService;

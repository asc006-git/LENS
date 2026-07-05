import LearningSession from '../learning/learning-session.model';
import { AIModule, ActivityType } from '../../common/enums';
import { AIProcessingError, NotFoundError } from '../../common/errors';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import PromptManager from '../../ai/prompts/prompt-manager';
import { AiDebugLog } from '../../ai/models/ai-debug-log.model';

export class RecommendationService {
  static async generateRecommendations(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const conceptualConsistency = (session.reflection as any)?.conceptualConsistency || undefined;

    const prompt = PromptManager.createRecommendationPrompt({
      concepts: session.blueprint.concepts,
      conceptMastery: session.report.conceptMastery,
      validationResponses: session.validation.responses,
      strengths: session.report.strengths,
      growthOpportunities: session.report.growthOpportunities,
      conceptualConsistency,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      const recommendations = JSON.parse(response);

      session.guidedLearning = {
        activities: recommendations.activities || [],
        roadmap: recommendations.roadmap || [],
      };

      await session.save();
      return session.guidedLearning;
    } catch (error) {
      throw new AIProcessingError('Failed to generate recommendations', AIModule.RECOMMENDATION);
    }
  }

  static async getRecommendations(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    return session.guidedLearning;
  }

  static async completeActivity(sessionId: string, studentId: string, activityIndex: number) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    if (activityIndex >= 0 && activityIndex < session.guidedLearning.activities.length) {
      session.guidedLearning.activities[activityIndex].completed = true;
      await session.save();
    }

    return session.guidedLearning;
  }

  static async regenerate(sessionId: string, studentId: string, focusAreas: string[]) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const conceptualConsistency = (session.reflection as any)?.conceptualConsistency || undefined;

    const prompt = PromptManager.createRecommendationPrompt({
      concepts: session.blueprint.concepts.filter((c) => focusAreas.includes(c.name)),
      conceptMastery: session.report.conceptMastery,
      validationResponses: session.validation.responses,
      strengths: session.report.strengths,
      growthOpportunities: session.report.growthOpportunities,
      conceptualConsistency,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      const recommendations = JSON.parse(response);

      session.guidedLearning = {
        activities: recommendations.activities || [],
        roadmap: recommendations.roadmap || [],
      };

      await session.save();
      return session.guidedLearning;
    } catch (error) {
      throw new AIProcessingError('Failed to regenerate recommendations', AIModule.RECOMMENDATION);
    }
  }
}

export default RecommendationService;

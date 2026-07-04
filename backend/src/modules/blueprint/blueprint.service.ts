import LearningSession from '../learning/learning-session.model';
import { AIModule } from '../../common/enums';
import { AIProcessingError, NotFoundError } from '../../common/errors';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import PromptManager from '../../ai/prompts/prompt-manager';

export class BlueprintService {
  static async generateBlueprint(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    if (!session.aiAnalysis.generatedAt) {
      throw new AIProcessingError('AI analysis not completed yet', AIModule.BLUEPRINT);
    }

    const prompt = PromptManager.createBlueprintPrompt({
      concepts: session.aiAnalysis.concepts,
      topicClassification: session.aiAnalysis.topicClassification,
      difficultyEstimate: session.aiAnalysis.difficultyEstimate,
      learningObjectives: session.aiAnalysis.learningObjectives,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      const blueprint = JSON.parse(response);

      session.blueprint = {
        concepts: blueprint.concepts || [],
        learningGoals: blueprint.learningGoals || [],
        dependencies: blueprint.dependencies || {},
        estimatedTime: blueprint.estimatedTime || 60,
        difficulty: blueprint.difficulty || 'medium',
        confirmed: false,
      };

      await session.save();
      return session.blueprint;
    } catch (error) {
      throw new AIProcessingError('Failed to generate learning blueprint', AIModule.BLUEPRINT);
    }
  }

  static async confirmBlueprint(sessionId: string, studentId: string, confirmed: boolean = true) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    session.blueprint.confirmed = confirmed;
    session.blueprint.confirmedAt = new Date();

    await session.save();
    return session.blueprint;
  }
}

export default BlueprintService;

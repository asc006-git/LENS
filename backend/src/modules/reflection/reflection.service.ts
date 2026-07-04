import LearningSession from '../learning/learning-session.model';
import { AIModule } from '../../common/enums';
import { AIProcessingError, NotFoundError } from '../../common/errors';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import PromptManager from '../../ai/prompts/prompt-manager';

export class ReflectionService {
  static async generateReflection(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const prompt = PromptManager.createReflectionPrompt({
      concepts: session.blueprint.concepts,
      validationResponses: session.validation.responses,
      overallConfidence: session.validation.overallConfidence,
      overallUnderstanding: session.validation.overallUnderstanding,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      const reflection = JSON.parse(response);

      session.reflection = {
        sections: reflection.sections || [],
        studentEdits: {},
        aiGenerated: true,
        generatedAt: new Date(),
      };

      await session.save();
      return session.reflection;
    } catch (error) {
      throw new AIProcessingError('Failed to generate reflection', AIModule.REFLECTION);
    }
  }

  static async updateReflection(sessionId: string, studentId: string, sections: Array<{ title: string; content: string; type: string }>) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const edits: Record<string, string> = {};
    sections.forEach((section) => {
      const original = session.reflection.sections.find((s) => s.title === section.title);
      if (original && original.content !== section.content) {
        edits[section.title] = section.content;
      }
    });

    session.reflection.sections = sections;
    session.reflection.studentEdits = { ...session.reflection.studentEdits, ...edits };

    await session.save();
    return session.reflection;
  }

  static async getReflection(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    return session.reflection;
  }
}

export default ReflectionService;

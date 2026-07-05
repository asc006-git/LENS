import LearningSession from '../learning/learning-session.model';
import { AIModule, SessionStatus } from '../../common/enums';
import { AIProcessingError, NotFoundError } from '../../common/errors';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import PromptManager from '../../ai/prompts/prompt-manager';
import { DocumentAnalysisService } from '../learning/document-analysis.service';
import { AiDebugLog } from '../../ai/models/ai-debug-log.model';

function cleanJsonResponse(raw: string): string {
  return raw
    .replace(/```(?:json)?\s*/gi, '')
    .replace(/\s*```/g, '')
    .trim();
}

function safelyParseBlueprint(raw: string): Record<string, any> {
  const cleaned = cleanJsonResponse(raw);
  const parsed = JSON.parse(cleaned);

  if (!parsed.concepts && !parsed.learningGoals) {
    throw new Error('Blueprint response missing both "concepts" and "learningGoals"');
  }

  return {
    concepts: Array.isArray(parsed.concepts)
      ? parsed.concepts.map((c: any, i: number) => ({
          name: c.name || c.concept || `Concept ${i + 1}`,
          description: c.description || c.desc || '',
          weight: typeof c.weight === 'number' ? c.weight : typeof c.importance === 'number' ? c.importance / 10 : 0.5,
          order: typeof c.order === 'number' ? c.order : i + 1,
        }))
      : [],
    learningGoals: Array.isArray(parsed.learningGoals)
      ? parsed.learningGoals
      : Array.isArray(parsed.learningObjectives)
        ? parsed.learningObjectives
        : Array.isArray(parsed.goals)
          ? parsed.goals
          : [],
    dependencies: parsed.dependencies || parsed.prerequisites || {},
    estimatedTime: typeof parsed.estimatedTime === 'number' ? parsed.estimatedTime : 60,
    difficulty: parsed.difficulty || 'medium',
  };
}

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
      const blueprint = safelyParseBlueprint(response);

      session.blueprint = {
        ...blueprint,
        confirmed: false,
      } as any;

      await session.save();
      return session.blueprint;
    } catch (error) {
      await AiDebugLog.create({
        sessionId,
        module: 'blueprint',
        prompt: prompt.slice(0, 1000),
        responseText: '',
        aiModel: 'groq-llama-3.3-70b',
        duration: 0,
        error: `Blueprint parse failure: ${(error as Error).message}`,
      }).catch(() => {});
      throw new AIProcessingError('Failed to generate learning blueprint', AIModule.BLUEPRINT);
    }
  }

  static async generateBlueprintFromAnalysis(
    sessionId: string,
    studentId: string,
    analysisResult: {
      concepts: Array<{ name: string; difficulty: string; importance: number; bloomLevel?: string }>;
      learningObjectives: string[];
      summary: string;
    },
    facultyExpectations?: {
      expectedConcepts?: string[];
      rubricCriteria?: string[];
      learningObjectives?: string[];
      facultyNotes?: string;
    }
  ) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const prompt = PromptManager.createBlueprintPrompt({
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
      facultyExpectations,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      const blueprint = safelyParseBlueprint(response);

      session.blueprint = {
        ...blueprint,
        confirmed: false,
      } as any;

      session.status = SessionStatus.BLUEPRINT_GENERATED;
      session.sessionState.currentStage = SessionStatus.BLUEPRINT_GENERATED;
      session.sessionState.completionPercentage = 30;
      session.sessionState.lastActiveTime = new Date();

      await session.save();

      const validationQuestions = await DocumentAnalysisService.generateValidationQuestions(sessionId, {
        concepts: session.blueprint.concepts.map(c => ({
          name: c.name,
          difficulty: 'medium',
          importance: c.weight,
        })),
        learningObjectives: session.blueprint.learningGoals,
      });

      session.validation.questions = validationQuestions.questions.map(q => ({
        concept: q.concept,
        question: q.question,
        type: q.type || 'explain',
        expectedAnswerPoints: q.expectedAnswerPoints || [],
      }));
      await session.save();

      return { blueprint: session.blueprint, validationQuestions };
    } catch (error: any) {
      const rawResponse = error instanceof SyntaxError ? error.message : '';
      await AiDebugLog.create({
        sessionId,
        module: 'blueprint',
        prompt: prompt.slice(0, 1000),
        responseText: rawResponse.slice(0, 2000) || 'Failed to get AI response',
        aiModel: 'groq-llama-3.3-70b',
        duration: 0,
        error: `Blueprint parse failure: ${error.message}`,
      }).catch(() => {});

      if (error instanceof AIProcessingError) throw error;
      throw new AIProcessingError('Failed to generate learning blueprint from analysis', AIModule.BLUEPRINT);
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

import LearningSession from '../learning/learning-session.model';
import { AIModule, ValidationStatus } from '../../common/enums';
import { AIProcessingError, NotFoundError, AppError } from '../../common/errors';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import PromptManager from '../../ai/prompts/prompt-manager';
import { DocumentAnalysisService } from '../learning/document-analysis.service';

export class ValidationService {
  static async startValidation(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    if (!session.blueprint.confirmed) {
      throw new AppError('Blueprint must be confirmed before validation', 400, 'BLUEPRINT_NOT_CONFIRMED');
    }

    session.validation.startedAt = new Date();
    session.validation.responses = [];

    // Generate validation questions from blueprint concepts if not already stored
    if (!session.validation.questions || session.validation.questions.length === 0) {
      const questionsResult = await DocumentAnalysisService.generateValidationQuestions(sessionId, {
        concepts: session.blueprint.concepts.map(c => ({
          name: c.name,
          difficulty: 'medium',
          importance: c.weight,
        })),
        learningObjectives: session.blueprint.learningGoals,
      });
      session.validation.questions = questionsResult.questions.map(q => ({
        concept: q.concept,
        question: q.question,
        type: q.type || 'explain',
        expectedAnswerPoints: q.expectedAnswerPoints || [],
      }));
    }

    await session.save();
    return session.validation;
  }

  static async getCurrentQuestion(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const validatedConcepts = session.validation.responses.map((r) => r.concept);
    const conceptsToValidate = session.blueprint.concepts.filter((c) => !validatedConcepts.includes(c.name));

    if (conceptsToValidate.length === 0) {
      return null;
    }

    const concept = conceptsToValidate[0];

    const prompt = PromptManager.createValidationQuestionPrompt({
      concept: concept.name,
      description: concept.description,
      difficulty: session.blueprint.difficulty,
      previousResponses: session.validation.responses,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      const question = JSON.parse(response);

      return {
        concept: concept.name,
        question: question.question,
        options: question.options || [],
        hints: question.hints || [],
      };
    } catch (error) {
      throw new AIProcessingError('Failed to generate validation question', AIModule.VALIDATION);
    }
  }

  static async submitResponse(
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
  ) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    session.validation.responses.push({
      concept: response.concept,
      question: response.question,
      response: response.response,
      understanding: response.understanding,
      confidence: response.confidence,
      hints: response.hints,
    });

    const totalConfidence = session.validation.responses.reduce((sum, r) => sum + r.confidence, 0);
    session.validation.overallConfidence = totalConfidence / session.validation.responses.length;

    await session.save();
    return session.validation;
  }

  static async submitAndEvaluateAnswer(
    sessionId: string,
    studentId: string,
    data: {
      concept: string;
      question: string;
      studentAnswer: string;
      expectedAnswerPoints: string[];
      confidence: number;
    }
  ) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const evaluation = await DocumentAnalysisService.evaluateAnswer(
      sessionId,
      data.concept,
      data.question,
      data.studentAnswer,
      data.expectedAnswerPoints
    );

    session.validation.responses.push({
      concept: data.concept,
      question: data.question,
      response: data.studentAnswer,
      understanding: evaluation.score >= 0.7 ? 'strong' : evaluation.score >= 0.4 ? 'moderate' : 'needs_improvement',
      confidence: data.confidence,
      hints: [],
    });

    const totalConfidence = session.validation.responses.reduce((sum, r) => sum + r.confidence, 0);
    session.validation.overallConfidence = totalConfidence / session.validation.responses.length;

    await session.save();
    return { validation: session.validation, evaluation };
  }

  static async evaluateAnswerOnly(
    sessionId: string,
    data: {
      concept: string;
      question: string;
      studentAnswer: string;
      expectedAnswerPoints: string[];
    }
  ) {
    return DocumentAnalysisService.evaluateAnswer(
      sessionId,
      data.concept,
      data.question,
      data.studentAnswer,
      data.expectedAnswerPoints
    );
  }

  static async getHint(sessionId: string, studentId: string, concept: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const prompt = PromptManager.createHintPrompt({
      concept,
      previousResponses: session.validation.responses,
    });

    try {
      const response = await LLMAdapter.generate(prompt);
      return JSON.parse(response);
    } catch (error) {
      throw new AIProcessingError('Failed to generate hint', AIModule.VALIDATION);
    }
  }

  static async skipConcept(sessionId: string, studentId: string, concept: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    session.validation.responses.push({
      concept,
      question: 'Skipped',
      response: 'Skipped',
      understanding: 'unknown',
      confidence: 0,
      hints: [],
    });

    await session.save();
    return session.validation;
  }

  static async completeValidation(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    session.validation.completedAt = new Date();

    const totalConfidence = session.validation.responses.reduce((sum, r) => sum + r.confidence, 0);
    session.validation.overallConfidence = totalConfidence / session.validation.responses.length;

    if (session.validation.overallConfidence >= 0.7) {
      session.validation.overallUnderstanding = 'strong';
    } else if (session.validation.overallConfidence >= 0.4) {
      session.validation.overallUnderstanding = 'moderate';
    } else {
      session.validation.overallUnderstanding = 'needs_improvement';
    }

    await session.save();
    return session.validation;
  }
}

export default ValidationService;

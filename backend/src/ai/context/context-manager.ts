import { Types } from 'mongoose';
import LearningSession from '../../modules/learning/learning-session.model';
import User from '../../modules/users/user.model';
import logger from '../../common/utils/logger';

export interface LearningContext {
  student: {
    id: string;
    name: string;
    email: string;
    preferences: {
      learningStyle: string;
      aiExplanationDepth: string;
      language: string;
    };
  };
  session: {
    id: string;
    learningObjective: string;
    status: string;
    uploadedFiles: Array<{ name: string; type: string }>;
  };
  analysis: {
    concepts: Array<{
      name: string;
      difficulty: number;
      bloomLevel: string;
      prerequisites: string[];
    }>;
    topicClassification: string;
    difficultyEstimate: number;
    learningObjectives: string[];
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
  };
  validation: {
    responses: Array<{
      concept: string;
      question: string;
      response: string;
      understanding: string;
      confidence: number;
    }>;
    overallConfidence: number;
    overallUnderstanding: string;
  };
  portfolio: {
    totalSessions: number;
    averageConfidence: number;
    masteredConcepts: string[];
  };
}

export class ContextManager {
  static async buildLearningContext(
    studentId: string,
    sessionId: string
  ): Promise<LearningContext> {
    const student = await User.findById(studentId).select('-password -refreshToken');
    if (!student) {
      throw new Error('Student not found');
    }

    const session = await LearningSession.findOne({
      _id: sessionId,
      student: studentId,
    });
    if (!session) {
      throw new Error('Session not found');
    }

    const portfolio = await this.buildPortfolioContext(studentId);

    return {
      student: {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        preferences: {
          learningStyle: student.preferences.learningStyle,
          aiExplanationDepth: student.preferences.aiExplanationDepth,
          language: student.preferences.language,
        },
      },
      session: {
        id: session._id.toString(),
        learningObjective: session.learningObjective || '',
        status: session.status,
        uploadedFiles: session.uploadedFiles.map((f) => ({
          name: f.name,
          type: f.type,
        })),
      },
      analysis: {
        concepts: session.aiAnalysis.concepts,
        topicClassification: session.aiAnalysis.topicClassification || '',
        difficultyEstimate: session.aiAnalysis.difficultyEstimate || 0,
        learningObjectives: session.aiAnalysis.learningObjectives || [],
      },
      blueprint: {
        concepts: session.blueprint.concepts || [],
        learningGoals: session.blueprint.learningGoals || [],
        dependencies: session.blueprint.dependencies || {},
        estimatedTime: session.blueprint.estimatedTime || 0,
        difficulty: session.blueprint.difficulty || 'medium',
      },
      validation: {
        responses: session.validation.responses || [],
        overallConfidence: session.validation.overallConfidence || 0,
        overallUnderstanding: session.validation.overallUnderstanding || '',
      },
      portfolio,
    };
  }

  private static async buildPortfolioContext(studentId: string) {
    const sessions = await LearningSession.find({
      student: studentId,
      status: 'completed',
    }).limit(20);

    const totalSessions = sessions.length;
    const averageConfidence =
      totalSessions > 0
        ? sessions.reduce((sum, s) => sum + s.validation.overallConfidence, 0) / totalSessions
        : 0;

    const masteredConcepts: string[] = [];
    sessions.forEach((session) => {
      Object.entries(session.report.conceptMastery).forEach(([concept, mastery]) => {
        if ((mastery as number) >= 0.8 && !masteredConcepts.includes(concept)) {
          masteredConcepts.push(concept);
        }
      });
    });

    return {
      totalSessions,
      averageConfidence,
      masteredConcepts,
    };
  }

  static formatContextForPrompt(context: LearningContext): string {
    return `
STUDENT CONTEXT:
- Name: ${context.student.name}
- Learning Style: ${context.student.preferences.learningStyle}
- Explanation Depth: ${context.student.preferences.aiExplanationDepth}

SESSION CONTEXT:
- Learning Objective: ${context.session.learningObjective}
- Status: ${context.session.status}
- Files: ${context.session.uploadedFiles.map((f) => f.name).join(', ') || 'None'}

ANALYSIS:
- Topic: ${context.analysis.topicClassification}
- Difficulty: ${context.analysis.difficultyEstimate}
- Concepts: ${context.analysis.concepts.map((c) => c.name).join(', ')}

BLUEPRINT:
- Estimated Time: ${context.blueprint.estimatedTime} minutes
- Difficulty: ${context.blueprint.difficulty}
- Learning Goals: ${context.blueprint.learningGoals.join(', ')}

VALIDATION:
- Overall Confidence: ${context.validation.overallConfidence}
- Understanding: ${context.validation.overallUnderstanding}
- Responses: ${context.validation.responses.length}

PORTFOLIO:
- Total Sessions: ${context.portfolio.totalSessions}
- Average Confidence: ${context.portfolio.averageConfidence}
- Mastered Concepts: ${context.portfolio.masteredConcepts.join(', ') || 'None'}
    `.trim();
  }
}

export default ContextManager;

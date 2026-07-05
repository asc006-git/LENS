import LearningSession from '../learning/learning-session.model';
import { AIModule } from '../../common/enums';
import { AIProcessingError, NotFoundError } from '../../common/errors';
import LLMAdapter from '../../ai/adapters/llm-adapter';
import PromptManager from '../../ai/prompts/prompt-manager';
import { DocumentAnalysisService } from '../learning/document-analysis.service';
import { AiDebugLog } from '../../ai/models/ai-debug-log.model';

export class ReflectionService {
  static async getAllReflections(studentId: string) {
    const sessions = await LearningSession.find({
      student: studentId,
      'reflection.sections': { $exists: true, $not: { $size: 0 } },
    })
      .select('reflection blueprint course assignment createdAt')
      .populate('course', 'name')
      .populate('assignment', 'title');
    return sessions;
  }

  static async generateReflection(sessionId: string, studentId: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const priorSessions = await LearningSession.find({
      student: session.student,
      status: { $in: ['completed', 'report_generated', 'guided_learning'] },
      _id: { $ne: session._id },
    })
      .select('blueprint validation report')
      .sort({ updatedAt: -1 })
      .limit(5);

    let priorSessionPatterns: any = undefined;
    if (priorSessions.length > 0) {
      const conceptConsistency: Array<{ concept: string; priorTendency: string }> = [];
      let priorConfSum = 0;
      let priorConfCount = 0;

      for (const ps of priorSessions) {
        if (ps.validation?.overallConfidence) {
          priorConfSum += ps.validation.overallConfidence;
          priorConfCount++;
        }
        if (ps.blueprint?.concepts) {
          for (const c of ps.blueprint.concepts) {
            if (!conceptConsistency.find(cc => cc.concept === c.name)) {
              conceptConsistency.push({ concept: c.name, priorTendency: 'mentioned' });
            }
          }
        }
      }

      const avgConf = priorConfCount > 0 ? priorConfSum / priorConfCount : 0;
      priorSessionPatterns = {
        conceptConsistency,
        confidenceTrend: avgConf >= 0.7 ? 'improving' : avgConf >= 0.4 ? 'stable' : 'declining',
      };
    }

    const prompt = PromptManager.createReflectionPrompt({
      concepts: session.blueprint.concepts,
      validationResponses: session.validation.responses,
      overallConfidence: session.validation.overallConfidence,
      overallUnderstanding: session.validation.overallUnderstanding,
      priorSessionPatterns,
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

      if (reflection.conceptualConsistency) {
        (session.reflection as any).conceptualConsistency = reflection.conceptualConsistency;
      }

      await session.save();

      if (reflection.conceptualConsistency) {
        AiDebugLog.create({
          sessionId,
          module: 'reflection',
          prompt: 'conceptual-consistency',
          responseText: JSON.stringify(reflection.conceptualConsistency),
          aiModel: 'groq-llama-3.3-70b',
          duration: 0,
        }).catch(() => {});
      }

      return session.reflection;
    } catch (error) {
      throw new AIProcessingError('Failed to generate reflection', AIModule.REFLECTION);
    }
  }

  static async analyzeFreeTextReflection(
    sessionId: string,
    studentId: string,
    reflectionText: string
  ) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const concepts = session.blueprint.concepts.map(c => ({
      name: c.name,
      difficulty: 'medium' as 'easy' | 'medium' | 'hard',
      importance: c.weight,
    }));

    const analysis = await DocumentAnalysisService.analyzeReflection(
      sessionId,
      reflectionText,
      concepts
    );

    if (!session.reflection.sections || session.reflection.sections.length === 0) {
      session.reflection = {
        sections: [
          {
            title: 'Free-text Reflection',
            content: reflectionText,
            type: 'self_assessment',
          },
        ],
        studentEdits: {},
        aiGenerated: false,
        generatedAt: new Date(),
      };
    }

    const gapsSection = session.reflection.sections.find(s => s.title === 'Gaps Identified');
    if (gapsSection) {
      gapsSection.content = analysis.gapsIdentified.join('\n');
    } else {
      session.reflection.sections.push({
        title: 'Gaps Identified',
        content: analysis.gapsIdentified.join('\n'),
        type: 'gaps',
      });
    }

    session.reflection.aiGenerated = true;

    await session.save();
    return analysis;
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

  static async updateReflectionSection(sessionId: string, studentId: string, sectionId: string, content: string) {
    const session = await LearningSession.findOne({ _id: sessionId, student: studentId });
    if (!session) {
      throw new NotFoundError('Learning session');
    }

    const section = session.reflection.sections.find(
      (s: any) => s._id?.toString() === sectionId || s.title === sectionId
    );
    if (!section) {
      throw new NotFoundError('Reflection section');
    }

    const originalContent = section.content;
    section.content = content;

    if (originalContent !== content) {
      session.reflection.studentEdits = {
        ...session.reflection.studentEdits,
        [section.title]: content,
      };
      session.markModified('reflection');
    }

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

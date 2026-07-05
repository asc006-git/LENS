import LearningSession from '../learning/learning-session.model';
import User from '../users/user.model';
import { NotFoundError } from '../../common/errors';
import mongoose from 'mongoose';

export class PortfolioService {
  static async getPortfolio(studentId: string) {
    const sessions = await LearningSession.find({
      student: studentId,
      status: 'completed',
    }).sort({ updatedAt: -1 });

    const user = await User.findById(studentId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const totalSessions = sessions.length;
    const totalConcepts = sessions.reduce((sum, s) => sum + s.blueprint.concepts.length, 0);
    const averageConfidence = sessions.length
      ? sessions.reduce((sum, s) => sum + s.validation.overallConfidence, 0) / sessions.length
      : 0;

    const conceptMastery: Record<string, number> = {};
    sessions.forEach((session) => {
      Object.entries(session.report.conceptMastery).forEach(([concept, mastery]) => {
        if (conceptMastery[concept]) {
          conceptMastery[concept] = Math.max(conceptMastery[concept], mastery);
        } else {
          conceptMastery[concept] = mastery;
        }
      });
    });

    const streak = this.computeStreak(sessions);

    const dna = await this.getLearningDNA(studentId);
    const reflectionLibrary = sessions
      .filter((s) => s.reflection && s.reflection.sections && s.reflection.sections.length > 0)
      .map((s) => ({
        id: s._id.toString(),
        sessionTitle: s.learningObjective || 'Untitled Session',
        date: s.createdAt.toISOString(),
        content: s.reflection.sections.map((sec) => sec.content).filter(Boolean).join('\n') || '',
      }));

    return {
      student: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalSessions,
        totalConcepts,
        averageConfidence,
        totalStudyTime: sessions.reduce((sum, s) => sum + (s.blueprint.estimatedTime || 0), 0),
        streak,
      },
      conceptMastery,
      recentSessions: sessions.slice(0, 5).map((s) => ({
        id: s._id,
        learningObjective: s.learningObjective,
        status: s.status,
        confidence: s.validation.overallConfidence,
        completedAt: s.updatedAt,
      })),
      learningDNA: {
        primaryStyle: dna.learningStyle,
        secondaryStyle: 'visual',
        strengths: Object.keys(conceptMastery).filter((c) => conceptMastery[c] >= 80),
        growthAreas: Object.keys(conceptMastery).filter((c) => conceptMastery[c] < 80),
        learningPatterns: [],
      },
      reflectionLibrary,
    };
  }

  static async getTimeline(studentId: string, page: number = 1, limit: number = 20) {
    const total = await LearningSession.countDocuments({ student: studentId });
    const sessions = await LearningSession.find({ student: studentId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const timeline = sessions.map((session) => ({
      id: session._id,
      type: 'learning_session',
      title: session.learningObjective || 'Untitled Session',
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      completionPercentage: session.sessionState.completionPercentage,
      confidence: session.validation.overallConfidence,
    }));

    return {
      timeline,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private static computeStreak(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    const dates = sessions
      .map((s) => {
        const d = new Date(s.updatedAt || s.createdAt);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      })
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => b - a);

    if (dates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    const msPerDay = 86400000;
    let streak = 0;
    for (let i = 0; i < dates.length; i++) {
      const expected = todayMs - streak * msPerDay;
      if (dates[i] === expected) {
        streak++;
      } else if (streak === 0 && dates[i] === todayMs - msPerDay) {
        streak = 1;
      } else {
        break;
      }
    }
    return streak;
  }

  static async getLearningDNA(studentId: string) {
    const sessions = await LearningSession.find({
      student: studentId,
      status: 'completed',
    });

    const learningStyles: Record<string, number> = {};
    const bloomLevels: Record<string, number> = {};
    const difficultyPreferences: Record<string, number> = {};

    sessions.forEach((session) => {
      session.aiAnalysis.concepts.forEach((concept) => {
        bloomLevels[concept.bloomLevel] = (bloomLevels[concept.bloomLevel] || 0) + 1;
      });

      difficultyPreferences[session.blueprint.difficulty] =
        (difficultyPreferences[session.blueprint.difficulty] || 0) + 1;
    });

    const user = await User.findById(studentId);

    return {
      learningStyle: user?.preferences.learningStyle || 'visual',
      bloomLevelDistribution: bloomLevels,
      difficultyPreferences,
      averageSessionDuration:
        sessions.length > 0
          ? sessions.reduce((sum, s) => sum + (s.blueprint.estimatedTime || 0), 0) / sessions.length
          : 0,
      completionRate: sessions.length > 0 ? sessions.filter((s) => s.status === 'completed').length / sessions.length : 0,
    };
  }

  static async exportPortfolio(studentId: string, format: string = 'json') {
    const portfolio = await this.getPortfolio(studentId);
    const timeline = await this.getTimeline(studentId, 1, 100);
    const dna = await this.getLearningDNA(studentId);

    return {
      portfolio,
      timeline: timeline.timeline,
      learningDNA: dna,
      exportedAt: new Date(),
      format,
    };
  }
}

export default PortfolioService;

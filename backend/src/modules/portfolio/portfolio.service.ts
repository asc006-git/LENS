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
      },
      conceptMastery,
      recentSessions: sessions.slice(0, 5).map((s) => ({
        id: s._id,
        learningObjective: s.learningObjective,
        status: s.status,
        confidence: s.validation.overallConfidence,
        completedAt: s.updatedAt,
      })),
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

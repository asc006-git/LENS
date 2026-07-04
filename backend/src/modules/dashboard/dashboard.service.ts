import LearningSession from '../learning/learning-session.model';
import User from '../users/user.model';
import { NotFoundError } from '../../common/errors';
import { SessionStatus, UserRole } from '../../common/enums';

export class DashboardService {
  static async getStudentDashboard(studentId: string) {
    const student = await User.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    const activeSession = await LearningSession.findOne({
      student: studentId,
      status: { $nin: [SessionStatus.COMPLETED, SessionStatus.ARCHIVED] },
    }).sort({ updatedAt: -1 });

    const completedSessions = await LearningSession.find({
      student: studentId,
      status: SessionStatus.COMPLETED,
    }).sort({ updatedAt: -1 });

    const recentSessions = await LearningSession.find({ student: studentId })
      .sort({ updatedAt: -1 })
      .limit(5);

    const totalSessions = await LearningSession.countDocuments({ student: studentId });
    const totalCompleted = completedSessions.length;

    const averageConfidence = completedSessions.length
      ? completedSessions.reduce((sum, s) => sum + s.validation.overallConfidence, 0) / completedSessions.length
      : 0;

    const totalStudyTime = completedSessions.reduce((sum, s) => sum + (s.blueprint.estimatedTime || 0), 0);

    const conceptMastery: Record<string, number> = {};
    completedSessions.forEach((session) => {
      Object.entries(session.report.conceptMastery).forEach(([concept, mastery]) => {
        if (conceptMastery[concept]) {
          conceptMastery[concept] = Math.max(conceptMastery[concept], mastery as number);
        } else {
          conceptMastery[concept] = mastery as number;
        }
      });
    });

    const masteredConcepts = Object.values(conceptMastery).filter((m) => m >= 0.8).length;
    const totalConcepts = Object.keys(conceptMastery).length;

    const strengths: string[] = [];
    const growthOpportunities: string[] = [];
    completedSessions.forEach((session) => {
      strengths.push(...session.report.strengths);
      growthOpportunities.push(...session.report.growthOpportunities);
    });

    const uniqueStrengths = [...new Set(strengths)].slice(0, 5);
    const uniqueGrowthOpportunities = [...new Set(growthOpportunities)].slice(0, 5);

    return {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar,
      },
      stats: {
        totalSessions,
        totalCompleted,
        completionRate: totalSessions > 0 ? totalCompleted / totalSessions : 0,
        averageConfidence,
        totalStudyTime,
        masteredConcepts,
        totalConcepts,
        masteryRate: totalConcepts > 0 ? masteredConcepts / totalConcepts : 0,
      },
      activeSession: activeSession
        ? {
            id: activeSession._id,
            learningObjective: activeSession.learningObjective,
            status: activeSession.status,
            completionPercentage: activeSession.sessionState.completionPercentage,
            lastActiveTime: activeSession.sessionState.lastActiveTime,
          }
        : null,
      recentSessions: recentSessions.map((s) => ({
        id: s._id,
        learningObjective: s.learningObjective,
        status: s.status,
        completionPercentage: s.sessionState.completionPercentage,
        confidence: s.validation.overallConfidence,
        updatedAt: s.updatedAt,
      })),
      insights: {
        strengths: uniqueStrengths,
        growthOpportunities: uniqueGrowthOpportunities,
        topConcepts: Object.entries(conceptMastery)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([concept, mastery]) => ({ concept, mastery })),
      },
      streak: await this.calculateStreak(studentId),
    };
  }

  private static async calculateStreak(studentId: string): Promise<number> {
    const sessions = await LearningSession.find({
      student: studentId,
      status: SessionStatus.COMPLETED,
    })
      .sort({ updatedAt: -1 })
      .limit(30);

    if (sessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(today);

    for (const session of sessions) {
      const sessionDate = new Date(session.updatedAt);
      sessionDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return streak;
  }
}

export default DashboardService;

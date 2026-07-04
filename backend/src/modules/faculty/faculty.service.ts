import mongoose from 'mongoose';
import User from '../users/user.model';
import LearningSession from '../learning/learning-session.model';
import { NotFoundError, AuthorizationError } from '../../common/errors';
import { UserRole } from '../../common/enums';

export class FacultyService {
  static async getDashboard(facultyId: string) {
    const faculty = await User.findById(facultyId);
    if (!faculty) {
      throw new NotFoundError('Faculty member');
    }

    if (faculty.role !== UserRole.FACULTY && faculty.role !== UserRole.INSTITUTION_ADMIN) {
      throw new AuthorizationError('Not authorized');
    }

    const totalStudents = await User.countDocuments({
      role: UserRole.STUDENT,
      institution: faculty.institution,
    });

    const activeSessions = await LearningSession.countDocuments({
      status: { $nin: ['completed', 'archived'] },
    });

    const completedSessions = await LearningSession.countDocuments({
      status: 'completed',
    });

    const averageConfidence = await LearningSession.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$validation.overallConfidence' } } },
    ]);

    const recentSessions = await LearningSession.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('student', 'name email');

    return {
      stats: {
        totalStudents,
        activeSessions,
        completedSessions,
        averageConfidence: averageConfidence[0]?.avg || 0,
      },
      recentSessions,
    };
  }

  static async getCourseAnalytics(facultyId: string, courseId: string) {
    const sessions = await LearningSession.find({ course: courseId });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.status === 'completed').length;
    const averageConfidence = sessions.length
      ? sessions.reduce((sum, s) => sum + s.validation.overallConfidence, 0) / sessions.length
      : 0;

    const conceptStats: Record<string, { total: number; mastered: number }> = {};
    sessions.forEach((session) => {
      session.blueprint.concepts.forEach((concept) => {
        if (!conceptStats[concept.name]) {
          conceptStats[concept.name] = { total: 0, mastered: 0 };
        }
        conceptStats[concept.name].total++;
        if ((session.report.conceptMastery[concept.name] || 0) >= 0.7) {
          conceptStats[concept.name].mastered++;
        }
      });
    });

    return {
      totalSessions,
      completedSessions,
      completionRate: totalSessions > 0 ? completedSessions / totalSessions : 0,
      averageConfidence,
      conceptStats,
    };
  }

  static async getStudentIntelligence(facultyId: string, studentId: string) {
    const student = await User.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    const sessions = await LearningSession.find({
      student: studentId,
      status: 'completed',
    }).sort({ updatedAt: -1 });

    const totalSessions = sessions.length;
    const averageConfidence = sessions.length
      ? sessions.reduce((sum, s) => sum + s.validation.overallConfidence, 0) / sessions.length
      : 0;

    const conceptMastery: Record<string, number> = {};
    sessions.forEach((session) => {
      Object.entries(session.report.conceptMastery).forEach(([concept, mastery]) => {
        if (conceptMastery[concept]) {
          conceptMastery[concept] = Math.max(conceptMastery[concept], mastery as number);
        } else {
          conceptMastery[concept] = mastery as number;
        }
      });
    });

    return {
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
      stats: {
        totalSessions,
        averageConfidence,
        totalConcepts: Object.keys(conceptMastery).length,
      },
      conceptMastery,
      recentActivity: sessions.slice(0, 5).map((s) => ({
        id: s._id,
        learningObjective: s.learningObjective,
        confidence: s.validation.overallConfidence,
        completedAt: s.updatedAt,
      })),
    };
  }

  static async getStudentJourney(facultyId: string, studentId: string) {
    const sessions = await LearningSession.find({ student: studentId }).sort({
      createdAt: 1,
    });

    return sessions.map((session) => ({
      id: session._id,
      learningObjective: session.learningObjective,
      status: session.status,
      createdAt: session.createdAt,
      completedAt: session.status === 'completed' ? session.updatedAt : null,
      confidence: session.validation.overallConfidence,
      concepts: session.blueprint.concepts.length,
    }));
  }

  static async getTeachingRecommendations(facultyId: string) {
    const sessions = await LearningSession.find({ status: 'completed' }).sort({
      updatedAt: -1,
    });

    const conceptDifficulties: Record<string, { total: number; lowConfidence: number }> = {};
    sessions.forEach((session) => {
      session.validation.responses.forEach((response) => {
        if (!conceptDifficulties[response.concept]) {
          conceptDifficulties[response.concept] = { total: 0, lowConfidence: 0 };
        }
        conceptDifficulties[response.concept].total++;
        if (response.confidence < 0.5) {
          conceptDifficulties[response.concept].lowConfidence++;
        }
      });
    });

    const challengingConcepts = Object.entries(conceptDifficulties)
      .map(([concept, stats]) => ({
        concept,
        difficultyRate: stats.lowConfidence / stats.total,
        totalResponses: stats.total,
      }))
      .filter((c) => c.totalResponses >= 3)
      .sort((a, b) => b.difficultyRate - a.difficultyRate)
      .slice(0, 10);

    return {
      challengingConcepts,
      totalStudents: await User.countDocuments({ role: UserRole.STUDENT }),
      averageCompletionRate: sessions.length > 0 ? sessions.filter((s) => s.status === 'completed').length / sessions.length : 0,
    };
  }

  static async createIntervention(facultyId: string, studentId: string, data: { type: string; message: string; concepts?: string[] }) {
    return {
      interventionId: new mongoose.Types.ObjectId().toString(),
      facultyId,
      studentId,
      ...data,
      createdAt: new Date(),
      status: 'pending',
    };
  }

  static async getImpact(facultyId: string, startDate: Date, endDate: Date) {
    const sessions = await LearningSession.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.status === 'completed').length;
    const averageConfidence = sessions.length
      ? sessions.reduce((sum, s) => sum + s.validation.overallConfidence, 0) / sessions.length
      : 0;

    return {
      period: { startDate, endDate },
      stats: {
        totalSessions,
        completedSessions,
        completionRate: totalSessions > 0 ? completedSessions / totalSessions : 0,
        averageConfidence,
      },
    };
  }
}

export default FacultyService;

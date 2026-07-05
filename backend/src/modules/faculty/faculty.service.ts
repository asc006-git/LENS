import mongoose from 'mongoose';
import User from '../users/user.model';
import LearningSession from '../learning/learning-session.model';
import Course from '../course/course.model';
import Intervention from './intervention.model';
import { NotFoundError, AuthorizationError } from '../../common/errors';
import { UserRole } from '../../common/enums';

export class FacultyService {
  static async getDashboard(facultyId: string) {
    const faculty = await User.findById(facultyId);
    if (!faculty) throw new NotFoundError('Faculty member');
    if (faculty.role !== UserRole.FACULTY && faculty.role !== UserRole.INSTITUTION_ADMIN) {
      throw new AuthorizationError('Not authorized');
    }

    const totalStudents = await User.countDocuments({ role: UserRole.STUDENT, institution: faculty.institution });
    const totalSessions = await LearningSession.countDocuments({});
    const activeSessions = await LearningSession.countDocuments({ status: { $nin: ['completed', 'archived'] } });
    const completedSessions = await LearningSession.countDocuments({ status: 'completed' });

    const avgConfResult = await LearningSession.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$validation.overallConfidence' } } },
    ]);
    const averageConfidence = avgConfResult[0]?.avg || 0;

    const recentSessions = await LearningSession.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('student', 'name email');

    const interventions = await Intervention.find({ facultyId }).sort({ createdAt: -1 }).limit(5);

    const recentActivity = recentSessions.map((s: any) => ({
      id: s._id.toString(),
      type: 'session',
      description: `${s.student?.name || 'A student'} completed a session on "${s.learningObjective || 'a topic'}"`,
      studentName: s.student?.name || 'Unknown',
      timestamp: s.updatedAt,
    }));

    const conceptHeatmap = await LearningSession.aggregate([
      { $unwind: '$blueprint.concepts' },
      { $group: { _id: '$blueprint.concepts.name', avgMastery: { $avg: { $ifNull: [{ $toDouble: { $toString: { $getField: { field: { $toString: '$blueprint.concepts.name' }, input: '$report.conceptMastery' } } } }, 0] } }, count: { $sum: 1 } } },
      { $project: { concept: '$_id', course: 'All', averageMastery: { $round: ['$avgMastery', 2] }, studentCount: '$count', difficulty: { $subtract: [1, { $round: ['$avgMastery', 2] }] } } },
      { $sort: { averageMastery: 1 } },
      { $limit: 20 },
    ]);

    return {
      activeSessions,
      totalStudents,
      averageAuthenticity: Math.round(averageConfidence * 100),
      studentConfidence: Math.round(averageConfidence * 100),
      conceptHeatmap: conceptHeatmap.map((c: any) => ({
        concept: c.concept,
        course: c.course,
        averageMastery: c.averageMastery,
        studentCount: c.studentCount,
        difficulty: c.difficulty,
      })),
      recentActivity,
      interventions: interventions.map((i: any) => ({
        id: i._id.toString(),
        title: i.title,
        description: i.description,
        targetStudents: i.targetStudents || [],
        targetConcepts: i.targetConcepts || [],
        status: i.status,
        startDate: i.startDate?.toISOString() || '',
        endDate: i.endDate?.toISOString() || '',
        createdAt: i.createdAt.toISOString(),
      })),
    };
  }

  static async getFacultyCourses(facultyId: string) {
    const courses = await Course.find({ facultyId }).sort({ createdAt: -1 }).populate('students', '_id');
    return Promise.all(courses.map(async (course) => {
      const sessions = await LearningSession.find({ course: course._id, status: 'completed' });
      const avgConf = sessions.length
        ? sessions.reduce((sum, s) => sum + (s.validation?.overallConfidence || 0), 0) / sessions.length
        : 0;
      const conceptMastery = sessions.length
        ? sessions.reduce((sum, s) => {
            const vals = Object.values(s.report?.conceptMastery || {}) as number[];
            return sum + (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);
          }, 0) / sessions.length
        : 0;
      return {
        id: course._id.toString(),
        name: course.name,
        code: course.code,
        description: course.description,
        semester: course.semester,
        studentCount: (course.students || []).length,
        averageAuthenticity: Math.round(avgConf * 100),
        conceptMastery: Math.round(conceptMastery * 100),
        createdAt: course.createdAt?.toISOString() || '',
      };
    }));
  }

  static async getFacultyCourseDetail(facultyId: string, courseId: string) {
    const course = await Course.findById(courseId).populate('students', 'name email');
    if (!course) throw new NotFoundError('Course');
    if (course.facultyId.toString() !== facultyId) throw new AuthorizationError('Not your course');

    const sessions = await LearningSession.find({ course: courseId }).populate('student', 'name email');
    const completedSessions = sessions.filter((s) => s.status === 'completed');
    const totalSessions = sessions.length;
    const averageConfidence = completedSessions.length
      ? completedSessions.reduce((sum, s) => sum + (s.validation?.overallConfidence || 0), 0) / completedSessions.length
      : 0;

    const flaggedSessions = sessions
      .filter((s) => s.status === 'assignment_mismatch')
      .map((s) => ({
        id: s._id.toString(),
        studentName: (s.student as any)?.name || 'Unknown',
        learningObjective: s.learningObjective,
        createdAt: s.createdAt,
        reason: (s as any).assignmentMismatchReason || '',
      }));

    const conceptStats: Record<string, { total: number; mastered: number }> = {};
    sessions.forEach((session) => {
      (session.blueprint?.concepts || []).forEach((concept: any) => {
        if (!conceptStats[concept.name]) {
          conceptStats[concept.name] = { total: 0, mastered: 0 };
        }
        conceptStats[concept.name].total++;
        if ((session.report?.conceptMastery?.[concept.name] || 0) >= 0.7) {
          conceptStats[concept.name].mastered++;
        }
      });
    });

    const totalConceptMastery = Object.values(conceptStats).length
      ? Object.values(conceptStats).reduce((sum, s) => sum + (s.total > 0 ? s.mastered / s.total : 0), 0) / Object.values(conceptStats).length
      : 0;

    return {
      id: course._id.toString(),
      name: course.name,
      code: course.code,
      description: course.description,
      semester: course.semester,
      studentCount: (course.students || []).length,
      averageAuthenticity: Math.round(averageConfidence * 100),
      conceptMastery: Math.round(totalConceptMastery * 100),
      createdAt: course.createdAt?.toISOString() || '',
      totalSessions,
      completedSessions: completedSessions.length,
      completionRate: totalSessions > 0 ? completedSessions.length / totalSessions : 0,
      conceptStats,
      flaggedSessions,
    };
  }

  static async getCourseAnalytics(facultyId: string, courseId: string) {
    return this.getFacultyCourseDetail(facultyId, courseId);
  }

  static async getStudentIntelligence(facultyId: string, studentId: string) {
    const student = await User.findById(studentId);
    if (!student) throw new NotFoundError('Student');

    const sessions = await LearningSession.find({
      student: studentId,
      status: 'completed',
    }).sort({ updatedAt: -1 });

    const totalSessions = sessions.length;
    const averageConfidence = sessions.length
      ? sessions.reduce((sum, s) => sum + (s.validation?.overallConfidence || 0), 0) / sessions.length
      : 0;

    const conceptMastery: Record<string, number> = {};
    sessions.forEach((session) => {
      Object.entries(session.report?.conceptMastery || {}).forEach(([concept, mastery]) => {
        if (conceptMastery[concept]) {
          conceptMastery[concept] = Math.max(conceptMastery[concept], mastery as number);
        } else {
          conceptMastery[concept] = mastery as number;
        }
      });
    });

    return {
      student: { id: student._id, name: student.name, email: student.email },
      stats: { totalSessions, averageConfidence, totalConcepts: Object.keys(conceptMastery).length },
      conceptMastery,
      recentActivity: sessions.slice(0, 5).map((s) => ({
        id: s._id,
        learningObjective: s.learningObjective,
        confidence: s.validation?.overallConfidence || 0,
        completedAt: s.updatedAt,
      })),
    };
  }

  static async getStudentJourney(facultyId: string, studentId: string) {
    const sessions = await LearningSession.find({ student: studentId }).sort({ createdAt: 1 });
    return sessions.map((session) => ({
      id: session._id,
      learningObjective: session.learningObjective,
      status: session.status,
      createdAt: session.createdAt,
      completedAt: session.status === 'completed' ? session.updatedAt : null,
      confidence: session.validation?.overallConfidence || 0,
      concepts: (session.blueprint?.concepts || []).length,
    }));
  }

  static async getTeachingRecommendations(facultyId: string) {
    const allSessions = await LearningSession.find().sort({ updatedAt: -1 });
    const completedSessions = allSessions.filter((s) => s.status === 'completed');

    const avgConf = completedSessions.length
      ? completedSessions.reduce((sum, s) => sum + (s.validation?.overallConfidence || 0), 0) / completedSessions.length
      : 0;

    const conceptDifficulties: Record<string, { total: number; lowConfidence: number }> = {};
    completedSessions.forEach((session) => {
      (session.validation?.responses || []).forEach((response: any) => {
        if (!conceptDifficulties[response.concept]) {
          conceptDifficulties[response.concept] = { total: 0, lowConfidence: 0 };
        }
        conceptDifficulties[response.concept].total++;
        if (response.confidence < 0.5) {
          conceptDifficulties[response.concept].lowConfidence++;
        }
      });
    });

    const conceptEntries = Object.entries(conceptDifficulties)
      .map(([concept, stats]) => ({ concept, difficultyRate: stats.lowConfidence / stats.total, totalResponses: stats.total }));

    const challengingConcepts = conceptEntries
      .filter((c) => c.totalResponses >= 3)
      .sort((a, b) => b.difficultyRate - a.difficultyRate)
      .slice(0, 10);

    const easyConcepts = conceptEntries
      .filter((c) => c.difficultyRate < 0.3)
      .sort((a, b) => a.difficultyRate - b.difficultyRate)
      .slice(0, 3);

    const totalStudents = await User.countDocuments({ role: UserRole.STUDENT });
    const totalActiveSessions = allSessions.filter((s) => s.status !== 'completed' && s.status !== 'archived').length;
    const uniqueConcepts = new Set<string>();
    completedSessions.forEach((s) => (s.blueprint?.concepts || []).forEach((c: any) => uniqueConcepts.add(c.name)));
    const conceptCoverage = uniqueConcepts.size;

    const aiSuggestions = challengingConcepts.length > 0
      ? challengingConcepts.slice(0, 3).map((c) =>
          `Students are struggling with "${c.concept}" — ${Math.round(c.difficultyRate * 100)}% of responses show low confidence. Consider a targeted review session.`
        )
      : ['No significant challenges detected yet. Continue monitoring student progress.'];

    return {
      classAverageAuthenticity: Math.round(avgConf * 100),
      classAverageConfidence: Math.round(avgConf * 100),
      totalActiveSessions,
      conceptCoverage,
      topStrengths: easyConcepts.map((c) => c.concept),
      topWeaknesses: challengingConcepts.map((c) => c.concept),
      aiSuggestions,
      totalStudents,
      averageCompletionRate: allSessions.length > 0 ? completedSessions.length / allSessions.length : 0,
    };
  }

  static async getInterventions(facultyId: string) {
    return Intervention.find({ facultyId }).sort({ createdAt: -1 }).limit(50);
  }

  static async createIntervention(facultyId: string, data: {
    title: string;
    description: string;
    targetStudents?: string[];
    targetConcepts?: string[];
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const intervention = await Intervention.create({
      facultyId: new mongoose.Types.ObjectId(facultyId),
      title: data.title,
      description: data.description,
      targetStudents: (data.targetStudents || []).map((id: string) => new mongoose.Types.ObjectId(id)),
      targetConcepts: data.targetConcepts || [],
      status: data.status || 'draft',
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });
    return intervention;
  }

  static async getImpact(facultyId: string, startDate: Date, endDate: Date) {
    const sessions = await LearningSession.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.status === 'completed').length;
    const averageConfidence = sessions.length
      ? sessions.reduce((sum, s) => sum + (s.validation?.overallConfidence || 0), 0) / sessions.length
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

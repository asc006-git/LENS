import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../common/middleware/auth';
import { sendSuccess } from '../../common/utils/response';
import { NotFoundError, AuthorizationError, AppError } from '../../common/errors';
import { UserRole } from '../../common/enums';
import User from '../users/user.model';
import Course from './course.model';
import Assignment from './assignment.model';
import LearningSession from '../learning/learning-session.model';
import logger from '../../common/utils/logger';

const router = Router();

router.use(authenticate);

function isFaculty(user: any): boolean {
  return user.role === UserRole.FACULTY || user.role === UserRole.INSTITUTION_ADMIN || user.role === UserRole.SYSTEM_ADMIN;
}

/* ───────── COURSES ───────── */

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isFaculty(req.user)) throw new AuthorizationError('Only faculty can create courses');
    const me = await User.findById(req.user!._id);
    if (!me || !me.institution) throw new AppError('Faculty must belong to an institution', 400, 'NO_INSTITUTION');

    const course = await Course.create({
      name: req.body.name,
      code: req.body.code,
      description: req.body.description || '',
      facultyId: req.user!._id,
      institution: me.institution,
      semester: req.body.semester || '',
      students: [],
    });
    sendSuccess(res, 'Course created', course, 201);
  } catch (e) { next(e); }
});

router.post('/:courseId/enroll', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) throw new NotFoundError('Course');

    const me = await User.findById(req.user!._id);
    if (!me || me.institution !== course.institution) throw new AuthorizationError('Not enrolled in this institution');

    if (!course.students.some(s => s.toString() === req.user!._id.toString())) {
      course.students.push(req.user!._id);
      await course.save();
    }
    sendSuccess(res, 'Enrolled successfully', { courseId: course._id });
  } catch (e) { next(e); }
});

router.post('/:courseId/enroll-student', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isFaculty(req.user)) throw new AuthorizationError('Only faculty can enroll students');
    const course = await Course.findById(req.params.courseId);
    if (!course) throw new NotFoundError('Course');
    if (course.facultyId.toString() !== req.user!._id.toString()) throw new AuthorizationError('Not your course');

    const student = await User.findOne({ email: req.body.email, role: UserRole.STUDENT });
    if (!student) throw new NotFoundError('Student with that email');
    if (student.institution !== course.institution) throw new AuthorizationError('Student is not in your institution');

    if (!course.students.some(s => s.toString() === student._id.toString())) {
      course.students.push(student._id);
      await course.save();
    }
    sendSuccess(res, 'Student enrolled', { courseId: course._id, studentId: student._id, studentName: student.name });
  } catch (e) { next(e); }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const me = await User.findById(req.user!._id);
    if (!me) throw new NotFoundError('User');

    let courses;
    if (isFaculty(req.user)) {
      courses = await Course.find({ facultyId: req.user!._id }).sort({ createdAt: -1 });
    } else {
      courses = await Course.find({ students: req.user!._id }).sort({ createdAt: -1 });
    }
    sendSuccess(res, 'Courses retrieved', courses);
  } catch (e) { next(e); }
});

router.get('/:courseId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('students', 'name email');
    if (!course) throw new NotFoundError('Course');
    sendSuccess(res, 'Course retrieved', course);
  } catch (e) { next(e); }
});

/* ───────── ASSIGNMENTS ───────── */

router.post('/:courseId/assignments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isFaculty(req.user)) throw new AuthorizationError('Only faculty can create assignments');
    const course = await Course.findById(req.params.courseId);
    if (!course) throw new NotFoundError('Course');
    if (course.facultyId.toString() !== req.user!._id.toString()) throw new AuthorizationError('Not your course');

    const assignment = await Assignment.create({
      courseId: course._id,
      facultyId: req.user!._id,
      title: req.body.title,
      description: req.body.description || '',
      dueDate: req.body.dueDate || undefined,
      fileAttachment: req.body.fileAttachment || undefined,
      expectedConcepts: req.body.expectedConcepts || undefined,
      rubricCriteria: req.body.rubricCriteria || undefined,
      learningObjectives: req.body.learningObjectives || undefined,
      facultyNotes: req.body.facultyNotes || undefined,
    });
    sendSuccess(res, 'Assignment created', assignment, 201);
  } catch (e) { next(e); }
});

router.get('/:courseId/assignments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignments = await Assignment.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    sendSuccess(res, 'Assignments retrieved', assignments);
  } catch (e) { next(e); }
});

router.get('/:courseId/assignments/:assignmentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) throw new NotFoundError('Assignment');
    sendSuccess(res, 'Assignment retrieved', assignment);
  } catch (e) { next(e); }
});

/* ───────── SUBMISSIONS ───────── */

router.get('/:courseId/assignments/:assignmentId/submissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isFaculty(req.user)) throw new AuthorizationError('Only faculty can view submissions');
    const course = await Course.findById(req.params.courseId);
    if (!course) throw new NotFoundError('Course');
    if (course.facultyId.toString() !== req.user!._id.toString()) throw new AuthorizationError('Not your course');

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) throw new NotFoundError('Assignment');

    const sessions = await LearningSession.find({
      course: new (require('mongoose').Types.ObjectId)(req.params.courseId),
    })
      .populate('student', 'name email')
      .sort({ updatedAt: -1 });

    const submissions = sessions.map((s: any) => ({
      studentId: s.student?._id || 'unknown',
      studentName: s.student?.name || 'Unknown',
      studentEmail: s.student?.email || '',
      sessionId: s._id,
      status: s.status,
      confidence: s.validation?.overallConfidence || 0,
      understanding: s.validation?.overallUnderstanding || '',
      conceptsCompleted: s.blueprint?.concepts?.length || 0,
      completedAt: s.status === 'completed' ? s.updatedAt : null,
    }));

    sendSuccess(res, 'Submissions retrieved', submissions);
  } catch (e) { next(e); }
});

/* ───────── STUDENT-ASSIGNMENT LOOKUP ───────── */

router.get('/assignments/mine', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const me = await User.findById(req.user!._id);
    if (!me) throw new NotFoundError('User');

    const courses = await Course.find({ students: req.user!._id });
    const courseIds = courses.map(c => c._id);
    const assignments = await Assignment.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 });

    sendSuccess(res, 'Your assignments retrieved', assignments);
  } catch (e) { next(e); }
});

export default router;

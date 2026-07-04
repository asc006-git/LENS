import { Request, Response, NextFunction } from 'express';
import LearningSessionService from './learning-session.service';
import { sendSuccess } from '../../common/utils/response';

export class LearningSessionController {
  static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.createSession(req.user!._id.toString(), req.body);
      sendSuccess(res, 'Session created successfully', session, 201);
    } catch (error) {
      next(error);
    }
  }

  static async uploadFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];
      const fileData = files.map((f) => ({
        name: f.originalname,
        url: f.path || f.filename,
        size: f.size,
        type: f.mimetype,
      }));
      const session = await LearningSessionService.uploadFiles(id, req.user!._id.toString(), fileData);
      sendSuccess(res, 'Files uploaded successfully', session);
    } catch (error) {
      next(error);
    }
  }

  static async startAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.startAnalysis(req.params.id, req.user!._id.toString());
      sendSuccess(res, 'Analysis started', session);
    } catch (error) {
      next(error);
    }
  }

  static async getBlueprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.getBlueprint(req.params.id, req.user!._id.toString());
      sendSuccess(res, 'Blueprint retrieved', session);
    } catch (error) {
      next(error);
    }
  }

  static async confirmBlueprint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.confirmBlueprint(req.params.id, req.user!._id.toString(), req.body);
      sendSuccess(res, 'Blueprint confirmed', session);
    } catch (error) {
      next(error);
    }
  }

  static async startValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.startValidation(req.params.id, req.user!._id.toString());
      sendSuccess(res, 'Validation started', session);
    } catch (error) {
      next(error);
    }
  }

  static async submitValidationResponse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.submitValidationResponse(req.params.id, req.user!._id.toString(), req.body);
      sendSuccess(res, 'Response submitted', session);
    } catch (error) {
      next(error);
    }
  }

  static async generateReflection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.generateReflection(req.params.id, req.user!._id.toString(), req.body);
      sendSuccess(res, 'Reflection generated', session);
    } catch (error) {
      next(error);
    }
  }

  static async generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.generateReport(req.params.id, req.user!._id.toString(), req.body);
      sendSuccess(res, 'Report generated', session);
    } catch (error) {
      next(error);
    }
  }

  static async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.getSession(req.params.id, req.user!._id.toString());
      sendSuccess(res, 'Session retrieved', session);
    } catch (error) {
      next(error);
    }
  }

  static async getActiveSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.getActiveSession(req.user!._id.toString());
      sendSuccess(res, 'Active session retrieved', session);
    } catch (error) {
      next(error);
    }
  }

  static async resumeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { deviceInfo } = req.body;
      const session = await LearningSessionService.resumeSession(req.params.id, req.user!._id.toString(), deviceInfo);
      sendSuccess(res, 'Session resumed', session);
    } catch (error) {
      next(error);
    }
  }

  static async completeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await LearningSessionService.completeSession(req.params.id, req.user!._id.toString());
      sendSuccess(res, 'Session completed', session);
    } catch (error) {
      next(error);
    }
  }

  static async getStudentSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as any;
      const result = await LearningSessionService.getStudentSessions(req.user!._id.toString(), page, limit, status);
      sendSuccess(res, 'Sessions retrieved', result.sessions, 200, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await LearningSessionService.deleteSession(req.params.id, req.user!._id.toString());
      sendSuccess(res, 'Session deleted');
    } catch (error) {
      next(error);
    }
  }
}

export default LearningSessionController;

import { Router, Request, Response, NextFunction } from 'express';
import PortfolioService from './portfolio.service';
import { sendSuccess } from '../../common/utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolio = await PortfolioService.getPortfolio(req.user!._id.toString());
    sendSuccess(res, 'Portfolio retrieved', portfolio);
  } catch (error) {
    next(error);
  }
});

router.get('/dna', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dna = await PortfolioService.getLearningDNA(req.user!._id.toString());
    sendSuccess(res, 'Learning DNA retrieved', dna);
  } catch (error) {
    next(error);
  }
});

router.get('/timeline', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const timeline = await PortfolioService.getTimeline(req.user!._id.toString(), page, limit);
    sendSuccess(res, 'Timeline retrieved', timeline);
  } catch (error) {
    next(error);
  }
});

router.get('/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const format = (req.query.format as string) || 'json';
    const data = await PortfolioService.exportPortfolio(req.user!._id.toString(), format);
    sendSuccess(res, 'Portfolio exported', data);
  } catch (error) {
    next(error);
  }
});

export default router;

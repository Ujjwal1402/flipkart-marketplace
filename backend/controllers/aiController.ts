/**
 * AI Assistant Controller Layer
 */
import { Request, Response, NextFunction } from 'express';
import { AiService } from '../services/aiService';
import { sendSuccess } from '../middlewares/errorHandler';

export class AiController {
  public static async queryAssistant(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        throw new Error('Query string is required');
      }
      const response = await AiService.askAssistant(query);
      return sendSuccess(res, response);
    } catch (err) {
      next(err);
    }
  }
}

/**
 * Cart Controller Layer
 */
import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cartService';
import { sendSuccess } from '../middlewares/errorHandler';

export class CartController {
  public static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || 'usr-default';
      const couponCode = req.query.coupon as string | undefined;
      const useSuperCoins = req.query.useSuperCoins === 'true';

      const result = CartService.getCart(userId, couponCode, useSuperCoins);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId = 'usr-default', productId, quantity = 1 } = req.body;
      if (!productId) {
        throw new Error('productId is required');
      }
      const result = CartService.addItem(userId, productId, Number(quantity));
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId = 'usr-default', productId, quantity } = req.body;
      if (!productId || quantity === undefined) {
        throw new Error('productId and quantity are required');
      }
      const result = CartService.updateQuantity(userId, productId, Number(quantity));
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId = 'usr-default', productId } = req.body;
      if (!productId) {
        throw new Error('productId is required');
      }
      const result = CartService.removeItem(userId, productId);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

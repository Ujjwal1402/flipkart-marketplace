/**
 * Order & User Controller Layer
 */
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService';
import { db } from '../../database';
import { sendSuccess } from '../middlewares/errorHandler';

export class OrderController {
  public static async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        userId = 'usr-default',
        addressId,
        paymentMethod = 'UPI',
        couponCode,
        useSuperCoins
      } = req.body;

      const order = OrderService.placeOrder({
        userId,
        addressId,
        paymentMethod,
        couponCode,
        useSuperCoins: Boolean(useSuperCoins)
      });

      return sendSuccess(res, order, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'usr-default';
      const orders = OrderService.getOrders(userId);
      return sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  public static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = OrderService.getOrderDetails(id);
      return sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  }

  public static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = OrderService.cancelOrder(id);
      return sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'usr-default';
      const user = db.getUser(userId);
      if (!user) throw new Error('User not found');
      const safe = { ...user };
      delete safe.passwordHash;
      return sendSuccess(res, safe);
    } catch (err) {
      next(err);
    }
  }

  // ================= ADDRESS CRUD =================
  public static async addUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.headers['x-user-id'] as string) || req.body.userId || 'usr-default';
      const address = req.body.address || req.body;
      if (!address || !address.name || !address.pincode || !address.addressLine) {
        throw new Error('Name, 6-digit pincode, and address line are required');
      }
      if (address.pincode.replace(/\D/g, '').length < 6) {
        throw new Error('Please enter a valid 6-digit PIN code');
      }
      if (address.phone && address.phone.replace(/\D/g, '').length < 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }
      const newAddress = db.addAddress(userId, address);
      return sendSuccess(res, newAddress, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async updateUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req.headers['x-user-id'] as string) || req.body.userId || 'usr-default';
      const address = req.body.address || req.body;
      if (!address) throw new Error('Address data is required');
      const updated = db.updateAddress(userId, id, address);
      if (!updated) {
        const err: any = new Error('Address not found');
        err.statusCode = 404;
        throw err;
      }
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  public static async deleteUserAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req.query.userId as string) || 'usr-default';
      const deleted = db.deleteAddress(userId, id);
      if (!deleted) {
        const err: any = new Error('Address not found or could not be deleted');
        err.statusCode = 404;
        throw err;
      }
      return sendSuccess(res, { deleted: true, id });
    } catch (err) {
      next(err);
    }
  }

  public static async setDefaultAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId = 'usr-default' } = req.body;
      const success = db.setDefaultAddress(userId, id);
      if (!success) {
        const err: any = new Error('Address not found');
        err.statusCode = 404;
        throw err;
      }
      return sendSuccess(res, { success: true, id });
    } catch (err) {
      next(err);
    }
  }

  // ================= WISHLIST =================
  public static async toggleWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId = 'usr-default', productId } = req.body;
      if (!productId) throw new Error('productId is required');
      const isSaved = db.toggleWishlist(userId, productId);
      const wishlist = db.getWishlist(userId);
      return sendSuccess(res, { isSaved, wishlist });
    } catch (err) {
      next(err);
    }
  }

  public static async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.query.userId as string) || 'usr-default';
      const wishlist = db.getWishlist(userId);
      return sendSuccess(res, wishlist);
    } catch (err) {
      next(err);
    }
  }
}

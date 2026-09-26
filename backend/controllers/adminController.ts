/**
 * Enterprise Admin Panel Controller Layer
 * Handles metrics, platform orders, customer oversight & status transitions
 */
import { Request, Response, NextFunction } from 'express';
import { db, OrderStatus } from '../../database';
import { sendSuccess } from '../middlewares/errorHandler';

export class AdminController {
  private static checkAdmin(req: Request) {
    const userId = (req.headers['x-user-id'] as string) || '';
    const userRole = (req.headers['x-user-role'] as string) || '';
    const user = userId ? db.getUserById(userId) : null;

    if (user && user.role === 'admin') return true;
    if (userRole === 'admin') return true;

    const err: any = new Error('Access denied: Administrator privileges required');
    err.statusCode = 403;
    throw err;
  }

  public static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      AdminController.checkAdmin(req);
      const metrics = db.getAdminMetrics();
      return sendSuccess(res, metrics);
    } catch (err) {
      next(err);
    }
  }

  public static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      AdminController.checkAdmin(req);
      const orders = db.getAllOrders();
      return sendSuccess(res, orders);
    } catch (err) {
      next(err);
    }
  }

  public static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      AdminController.checkAdmin(req);
      const { id } = req.params;
      const { status, description } = req.body;

      if (!status) {
        throw new Error('Status is required');
      }

      const validStatuses: OrderStatus[] = [
        'PLACED',
        'PACKED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED'
      ];

      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`);
      }

      const updated = db.updateOrderStatus(id, status, description);
      if (!updated) {
        const err: any = new Error('Order not found');
        err.statusCode = 404;
        throw err;
      }

      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  public static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = db.getAllUsers();
      return sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  }
}

/**
 * Seller Hub Controller Layer
 */
import { Request, Response, NextFunction } from 'express';
import { SellerService } from '../services/sellerService';
import { sendSuccess } from '../middlewares/errorHandler';

export class SellerController {
  public static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const sellerId = (req.query.sellerId as string) || 'seller-retailnet';
      const dashboard = SellerService.getSellerDashboard(sellerId);
      return sendSuccess(res, dashboard);
    } catch (err) {
      next(err);
    }
  }

  public static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        sellerId = 'seller-retailnet',
        title,
        brand,
        category,
        subCategory,
        price,
        mrp,
        stockQuantity,
        thumbnail,
        highlights,
        warranty
      } = req.body;

      if (!title || !price || !mrp) {
        throw new Error('Title, price, and MRP are required');
      }

      const newProduct = SellerService.addSellerProduct(sellerId, {
        title,
        brand: brand || 'Generic',
        category: category || 'electronics',
        subCategory,
        price: Number(price),
        mrp: Number(mrp),
        stockQuantity: Number(stockQuantity) || 10,
        thumbnail:
          thumbnail ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        highlights: Array.isArray(highlights) ? highlights : [highlights || 'Quality Assured'],
        warranty
      });

      return sendSuccess(res, newProduct, 201);
    } catch (err) {
      next(err);
    }
  }
}

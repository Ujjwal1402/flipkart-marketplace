/**
 * Product Controller Layer
 */
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { sendSuccess } from '../middlewares/errorHandler';

export class ProductController {
  public static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category,
        search,
        minPrice,
        maxPrice,
        minRating,
        brands,
        isFAssured,
        inStockOnly,
        sortBy,
        page,
        limit
      } = req.query;

      const brandList = brands ? (brands as string).split(',') : undefined;

      const result = ProductService.getAllProducts({
        category: category as string,
        search: search as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        brands: brandList,
        isFAssured: isFAssured === 'true',
        inStockOnly: inStockOnly === 'true',
        sortBy: sortBy as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 50
      });

      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async getSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const q = (req.query.q as string) || '';
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const suggestions = ProductService.getSuggestions(q, limit);
      return sendSuccess(res, suggestions);
    } catch (err) {
      next(err);
    }
  }

  public static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = ProductService.getProductById(id);
      const related = ProductService.getRelatedProducts(id);
      return sendSuccess(res, { product, related });
    } catch (err) {
      next(err);
    }
  }

  public static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = ProductService.getCategories();
      return sendSuccess(res, categories);
    } catch (err) {
      next(err);
    }
  }

  public static async getDealsOfTheDay(req: Request, res: Response, next: NextFunction) {
    try {
      const deals = ProductService.getDealsOfTheDay();
      return sendSuccess(res, deals);
    } catch (err) {
      next(err);
    }
  }

  public static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData = req.body;
      if (!productData.title || !productData.price || !productData.mrp) {
        throw new Error('Title, price, and MRP are required');
      }
      const newProduct = ProductService.createProduct({
        ...productData,
        price: Number(productData.price),
        mrp: Number(productData.mrp),
        discountPercent:
          productData.discountPercent ||
          Math.round(((productData.mrp - productData.price) / productData.mrp) * 100),
        rating: productData.rating || 4.5,
        ratingsCount: productData.ratingsCount || 10,
        reviewsCount: productData.reviewsCount || 2,
        isFAssured: productData.isFAssured ?? true,
        inStock: (productData.stockQuantity || 10) > 0,
        stockQuantity: Number(productData.stockQuantity) || 10,
        sellerId: productData.sellerId || 'seller-retailnet',
        sellerName: productData.sellerName || 'RetailNet Pvt Ltd',
        images: productData.images || [productData.thumbnail],
        thumbnail:
          productData.thumbnail ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        highlights: Array.isArray(productData.highlights) ? productData.highlights : ['100% Genuine'],
        specifications: productData.specifications || [],
        bankOffers: [],
        warranty: productData.warranty || '1 Year Brand Warranty',
        deliveryDays: productData.deliveryDays || 1,
        superCoinsEarnable: productData.superCoinsEarnable || 40,
        tags: productData.tags || [productData.category, productData.brand].filter(Boolean)
      });
      return sendSuccess(res, newProduct, 201);
    } catch (err) {
      next(err);
    }
  }

  public static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = ProductService.updateProduct(id, updates);
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  public static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      ProductService.deleteProduct(id);
      return sendSuccess(res, { deleted: true, id });
    } catch (err) {
      next(err);
    }
  }

  public static async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      if (stock === undefined) throw new Error('stock is required');
      ProductService.updateStock(id, Number(stock));
      return sendSuccess(res, { success: true, id, stock: Number(stock) });
    } catch (err) {
      next(err);
    }
  }
}

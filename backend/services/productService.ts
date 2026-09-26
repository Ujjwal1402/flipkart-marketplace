/**
 * Product Service Layer
 * Enterprise business logic for Catalog, Filters, Search & Recommendations
 */
import { db, Product, Category, ProductFilterParams } from '../../database';

export class ProductService {
  public static getAllProducts(params: ProductFilterParams) {
    return db.getProducts(params);
  }

  public static getProductById(id: string): Product {
    const product = db.getProductById(id);
    if (!product) {
      const error: any = new Error(`Product with ID '${id}' was not found`);
      error.statusCode = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }
    return product;
  }

  public static getCategories(): Category[] {
    return db.getCategories();
  }

  public static getDealsOfTheDay(): Product[] {
    const { products } = db.getProducts({ limit: 12 });
    return products.filter((p) => p.dealOfTheDay || p.discountPercent >= 15);
  }

  public static getFeaturedElectronics(): Product[] {
    const { products } = db.getProducts({ category: 'electronics', limit: 8 });
    return products;
  }

  public static getRelatedProducts(productId: string): Product[] {
    const target = db.getProductById(productId);
    if (!target) return [];

    const { products } = db.getProducts({ category: target.category, limit: 6 });
    return products.filter((p) => p.id !== productId);
  }

  public static getSuggestions(query: string, limit = 8) {
    return db.getSearchSuggestions(query, limit);
  }

  public static createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    return db.createProduct(productData);
  }

  public static updateProduct(id: string, updates: Partial<Product>): Product {
    const updated = db.updateProduct(id, updates);
    if (!updated) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }

  public static deleteProduct(id: string): boolean {
    const deleted = db.deleteProduct(id);
    if (!deleted) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return true;
  }

  public static updateStock(id: string, newStock: number): boolean {
    const updated = db.updateProductStock(id, newStock, true);
    if (!updated) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return true;
  }
}

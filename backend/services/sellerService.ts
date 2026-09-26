/**
 * Seller Hub Service Layer
 * Vendor Management, Inventory Allocation & Seller Order Tracking
 */
import { db, Product, Seller, Order } from '../../database';

export class SellerService {
  public static getSellerDashboard(sellerId = 'seller-retailnet'): {
    seller: Seller;
    products: Product[];
    orders: Order[];
    stats: {
      totalProducts: number;
      totalStock: number;
      totalOrders: number;
      totalRevenue: number;
      averageRating: number;
    };
  } {
    const seller = db.getSeller(sellerId) || db.getAllSellers()[0];
    const products = db.getSellerProducts(seller.id);
    const orders = db.getSellerOrders(seller.id);

    const totalStock = products.reduce((acc, p) => acc + p.stockQuantity, 0);
    const calculatedRevenue = orders.reduce((acc, o) => acc + o.pricing.finalAmount, 0);

    return {
      seller,
      products,
      orders,
      stats: {
        totalProducts: products.length,
        totalStock,
        totalOrders: orders.length + seller.totalSalesCount,
        totalRevenue: calculatedRevenue + seller.totalRevenue,
        averageRating: seller.rating
      }
    };
  }

  public static addSellerProduct(
    sellerId: string,
    productData: {
      title: string;
      brand: string;
      category: string;
      subCategory?: string;
      price: number;
      mrp: number;
      stockQuantity: number;
      thumbnail: string;
      highlights: string[];
      warranty?: string;
    }
  ): Product {
    const seller = db.getSeller(sellerId) || db.getAllSellers()[0];

    const discountPercent =
      productData.mrp > productData.price
        ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)
        : 0;

    const newProd = db.createProduct({
      title: productData.title,
      brand: productData.brand,
      category: productData.category,
      subCategory: productData.subCategory || 'General',
      price: Number(productData.price),
      mrp: Number(productData.mrp),
      discountPercent,
      rating: 4.5,
      ratingsCount: 1,
      reviewsCount: 0,
      isFAssured: true,
      inStock: productData.stockQuantity > 0,
      stockQuantity: Number(productData.stockQuantity),
      sellerId: seller.id,
      sellerName: seller.businessName,
      images: [productData.thumbnail],
      thumbnail: productData.thumbnail,
      highlights: productData.highlights.length > 0 ? productData.highlights : ['100% Genuine Quality'],
      specifications: [
        {
          category: 'General',
          items: [
            { key: 'Brand', value: productData.brand },
            { key: 'Seller', value: seller.businessName }
          ]
        }
      ],
      bankOffers: [
        {
          id: 'bo-new',
          bankName: 'Axis Bank',
          discountDescription: '5% Unlimited Cashback on Flipkart Axis Bank Card',
          terms: 'T&C Apply'
        }
      ],
      warranty: productData.warranty || '1 Year Brand Warranty',
      deliveryDays: 2,
      superCoinsEarnable: Math.floor(productData.price / 500) * 10 || 10,
      tags: [productData.brand.toLowerCase(), productData.category.toLowerCase(), 'new-arrival']
    });

    return newProd;
  }
}

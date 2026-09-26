/**
 * Database Models & Entity Definitions
 * Standardized MNC E-Commerce Schema
 */

export interface ProductSpecification {
  category: string; // e.g. "General", "Display Features", "Camera", "Battery"
  items: { key: string; value: string }[];
}

export interface BankOffer {
  id: string;
  bankName: string;
  discountDescription: string;
  terms: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  brand: string;
  category: string; // "mobiles" | "electronics" | "fashion" | "appliances" | "home" | "grocery" | "beauty"
  subCategory?: string;
  price: number; // Current selling price in INR
  mrp: number; // Maximum retail price in INR
  discountPercent: number; // Calculated or fixed
  rating: number; // e.g. 4.4
  ratingsCount: number; // e.g. 84200
  reviewsCount: number; // e.g. 6140
  isFAssured: boolean; // Iconic Flipkart Assured guarantee
  inStock: boolean;
  stockQuantity: number;
  sellerId: string;
  sellerName: string;
  images: string[];
  thumbnail: string;
  highlights: string[];
  specifications: ProductSpecification[];
  bankOffers: BankOffer[];
  warranty: string;
  deliveryDays: number; // e.g. 1 (tomorrow), 2, etc.
  superCoinsEarnable: number;
  featured?: boolean;
  dealOfTheDay?: boolean;
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Lucide icon identifier
  bannerImage: string;
  subcategories: string[];
}

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  locality: string;
  addressLine: string;
  city: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  addressType: 'HOME' | 'WORK';
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  passwordHash?: string;
  superCoins: number;
  isPlusMember: boolean;
  addresses: UserAddress[];
  savedPaymentMethods?: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  addedAt: string;
}

export type OrderStatus =
  | 'PLACED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  thumbnail: string;
  price: number;
  mrp: number;
  quantity: number;
  sellerName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  deliveryAddress: UserAddress;
  pricing: {
    totalMrp: number;
    totalDiscount: number;
    deliveryFee: number;
    platformFee: number;
    couponDiscount: number;
    superCoinsUsed: number;
    finalAmount: number;
  };
  payment: {
    method: 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'EMI';
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    transactionId: string;
  };
  status: OrderStatus;
  estimatedDelivery: string;
  courierName?: string;
  trackingNumber?: string;
  trackingHistory: TrackingStep[];
  createdAt: string;
}

export interface Seller {
  id: string;
  businessName: string;
  ownerName: string;
  gstin: string;
  email: string;
  phone: string;
  rating: number;
  totalSalesCount: number;
  totalRevenue: number;
  joinedAt: string;
  verified: boolean;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brands?: string[];
  isFAssured?: boolean;
  inStockOnly?: boolean;
  sortBy?: 'popularity' | 'price_low' | 'price_high' | 'discount' | 'newest';
  page?: number;
  limit?: number;
}

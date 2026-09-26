/**
 * Frontend Types & Shared Interfaces
 */
import {
  Product,
  Category,
  User,
  UserAddress,
  CartItem,
  Order,
  OrderStatus,
  TrackingStep,
  Seller,
  ProductFilterParams
} from '../../../database/models';

export type {
  Product,
  Category,
  User,
  UserAddress,
  CartItem,
  Order,
  OrderStatus,
  TrackingStep,
  Seller,
  ProductFilterParams
};

export interface CartCalculation {
  items: CartItem[];
  itemCount: number;
  totalMrp: number;
  totalDiscount: number;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  couponDiscount: number;
  appliedCoupon?: string;
  superCoinsDeduction: number;
  superCoinsUsed: number;
  finalAmount: number;
  totalSavings: number;
  estimatedSuperCoinsEarned: number;
}

export interface SearchSuggestionItem {
  text: string;
  type: 'product' | 'brand' | 'category';
  category?: string;
  count?: number;
}

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockCount: number;
  ordersByStatus: Record<string, number>;
}

export type ActiveModal =
  | null
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'seller'
  | 'admin'
  | 'auth'
  | 'aiAssistant'
  | 'addressManager';

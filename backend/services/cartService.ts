/**
 * Cart Service Layer
 * Enterprise Cart Calculation Engine with Flipkart pricing & fee policies
 */
import { db, CartItem } from '../../database';
import { APP_CONFIG } from '../config';

export interface CartCalculationResult {
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

export class CartService {
  public static getCart(
    userId: string,
    couponCode?: string,
    useSuperCoins = false
  ): CartCalculationResult {
    const items = db.getCart(userId);
    const user = db.getUser(userId);

    let totalMrp = 0;
    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      itemCount += item.quantity;
      totalMrp += item.product.mrp * item.quantity;
      subtotal += item.product.price * item.quantity;
    }

    const totalDiscount = totalMrp - subtotal;

    // Delivery fee rule
    let deliveryFee = 0;
    if (items.length > 0) {
      deliveryFee =
        subtotal >= APP_CONFIG.marketplace.freeDeliveryThreshold
          ? 0
          : APP_CONFIG.marketplace.standardDeliveryFee;
    }

    // Platform fee rule
    const platformFee = items.length > 0 ? APP_CONFIG.marketplace.platformFee : 0;

    // Coupon calculation
    let couponDiscount = 0;
    let appliedCoupon: string | undefined = undefined;

    if (couponCode && items.length > 0) {
      const matchCoupon = APP_CONFIG.marketplace.availableCoupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase()
      );
      if (matchCoupon && subtotal >= matchCoupon.minCartValue) {
        if (matchCoupon.discountPercent) {
          const calculated = Math.round((subtotal * matchCoupon.discountPercent) / 100);
          couponDiscount = Math.min(calculated, matchCoupon.maxDiscount || calculated);
        } else if (matchCoupon.flatDiscount) {
          couponDiscount = matchCoupon.flatDiscount;
        }
        appliedCoupon = matchCoupon.code;
      }
    }

    // SuperCoins deduction
    let superCoinsUsed = 0;
    let superCoinsDeduction = 0;

    if (useSuperCoins && user && user.superCoins > 0 && items.length > 0) {
      const maxApplicable = Math.min(
        user.superCoins,
        APP_CONFIG.marketplace.maxSuperCoinsPerOrder,
        Math.floor(subtotal * 0.1) // Max 10% of subtotal via SuperCoins
      );
      superCoinsUsed = maxApplicable;
      superCoinsDeduction = maxApplicable * APP_CONFIG.marketplace.superCoinValueInInr;
    }

    const finalAmount = Math.max(
      0,
      subtotal - couponDiscount - superCoinsDeduction + deliveryFee + platformFee
    );

    const totalSavings = totalDiscount + couponDiscount + superCoinsDeduction;

    const estimatedSuperCoinsEarned = Math.floor(
      (subtotal / 100) * APP_CONFIG.marketplace.superCoinEarnRatePer100
    );

    return {
      items,
      itemCount,
      totalMrp,
      totalDiscount,
      subtotal,
      deliveryFee,
      platformFee,
      couponDiscount,
      appliedCoupon,
      superCoinsDeduction,
      superCoinsUsed,
      finalAmount,
      totalSavings,
      estimatedSuperCoinsEarned
    };
  }

  public static addItem(userId: string, productId: string, quantity = 1) {
    db.addToCart(userId, productId, quantity);
    return this.getCart(userId);
  }

  public static updateQuantity(userId: string, productId: string, quantity: number) {
    db.updateCartQuantity(userId, productId, quantity);
    return this.getCart(userId);
  }

  public static removeItem(userId: string, productId: string) {
    db.removeFromCart(userId, productId);
    return this.getCart(userId);
  }

  public static clear(userId: string) {
    db.clearCart(userId);
    return this.getCart(userId);
  }
}

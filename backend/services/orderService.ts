/**
 * Order Service Layer
 * Multi-step checkout, Order Processing & Delivery Tracking
 */
import { db, Order, OrderItem, UserAddress } from '../../database';
import { CartService } from './cartService';

export interface PlaceOrderRequest {
  userId: string;
  addressId: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'EMI';
  couponCode?: string;
  useSuperCoins?: boolean;
}

export class OrderService {
  public static placeOrder(req: PlaceOrderRequest): Order {
    const user = db.getUser(req.userId);
    if (!user) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const address = user.addresses.find((a) => a.id === req.addressId) || user.addresses[0];
    if (!address) {
      const err: any = new Error('No valid delivery address selected');
      err.statusCode = 400;
      throw err;
    }

    const cartCalc = CartService.getCart(req.userId, req.couponCode, req.useSuperCoins);
    if (cartCalc.items.length === 0) {
      const err: any = new Error('Cart is empty. Please add items before checkout.');
      err.statusCode = 400;
      throw err;
    }

    const orderItems: OrderItem[] = cartCalc.items.map((item) => ({
      productId: item.productId,
      title: item.product.title,
      thumbnail: item.product.thumbnail,
      price: item.product.price,
      mrp: item.product.mrp,
      quantity: item.quantity,
      sellerName: item.product.sellerName
    }));

    // Deduct SuperCoins used from user wallet
    if (cartCalc.superCoinsUsed > 0) {
      db.updateSuperCoins(req.userId, -cartCalc.superCoinsUsed);
    }

    // Format estimated delivery string (e.g. "Tomorrow, by 9 PM" or "in 2 days")
    const maxDays = Math.max(...cartCalc.items.map((i) => i.product.deliveryDays || 2));
    const estimatedDelivery =
      maxDays <= 1 ? 'Tomorrow, by 9:00 PM' : `Within ${maxDays} days, by 9:00 PM`;

    const newOrder = db.createOrder({
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      items: orderItems,
      deliveryAddress: address,
      pricing: {
        totalMrp: cartCalc.totalMrp,
        totalDiscount: cartCalc.totalDiscount,
        deliveryFee: cartCalc.deliveryFee,
        platformFee: cartCalc.platformFee,
        couponDiscount: cartCalc.couponDiscount,
        superCoinsUsed: cartCalc.superCoinsUsed,
        finalAmount: cartCalc.finalAmount
      },
      payment: {
        method: req.paymentMethod,
        status: 'COMPLETED',
        transactionId: `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`
      },
      status: 'PLACED',
      estimatedDelivery
    });

    return newOrder;
  }

  public static getOrders(userId: string): Order[] {
    return db.getOrdersByUser(userId);
  }

  public static getOrderDetails(orderId: string): Order {
    const order = db.getOrderById(orderId);
    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return order;
  }

  public static cancelOrder(orderId: string): Order {
    const order = db.cancelOrder(orderId);
    if (!order) {
      const err: any = new Error('Order not found or cannot be cancelled');
      err.statusCode = 404;
      throw err;
    }
    return order;
  }
}

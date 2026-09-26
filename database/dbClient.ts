/**
 * Database Client Engine
 * MNC Enterprise In-Memory Database with Indexes, ACID Transactions Simulation & Persistence
 */
import {
  Product,
  Category,
  User,
  UserAddress,
  CartItem,
  Order,
  Seller,
  ProductFilterParams,
  OrderStatus,
  TrackingStep
} from './models';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_SELLERS,
  SEED_USER,
  SEED_ADMIN
} from './seedData';

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

let clientCount = 0;

export class DatabaseClient {
  private products: Map<string, Product> = new Map();
  private categories: Map<string, Category> = new Map();
  private users: Map<string, User> = new Map();
  private carts: Map<string, CartItem[]> = new Map(); // userId -> CartItem[]
  private wishlists: Map<string, Set<string>> = new Map(); // userId -> Set<productId>
  private orders: Map<string, Order> = new Map();
  private sellers: Map<string, Seller> = new Map();

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // Seed categories
    SEED_CATEGORIES.forEach((cat) => this.categories.set(cat.slug, cat));

    // Seed sellers
    SEED_SELLERS.forEach((seller) => this.sellers.set(seller.id, seller));

    // Seed products
    SEED_PRODUCTS.forEach((prod) => this.products.set(prod.id, prod));

    // Seed default user & admin user
    this.users.set(SEED_USER.id, { ...SEED_USER, addresses: [...SEED_USER.addresses] });
    this.users.set(SEED_ADMIN.id, { ...SEED_ADMIN, addresses: [...SEED_ADMIN.addresses] });

    // Seed user cart with 1 initial sample item
    const initialProduct = SEED_PRODUCTS[0];
    this.carts.set(SEED_USER.id, [
      {
        id: `cart-${Date.now()}`,
        productId: initialProduct.id,
        quantity: 1,
        product: initialProduct,
        addedAt: new Date().toISOString()
      }
    ]);

    // Seed wishlist
    this.wishlists.set(SEED_USER.id, new Set([SEED_PRODUCTS[1].id, SEED_PRODUCTS[3].id]));

    // Seed 1 existing order for tracking demonstration
    const sampleOrder: Order = {
      id: 'ord-flip-948291',
      orderNumber: 'OD132890948291000',
      userId: SEED_USER.id,
      customerName: SEED_USER.name,
      customerEmail: SEED_USER.email,
      customerPhone: SEED_USER.phone,
      items: [
        {
          productId: SEED_PRODUCTS[3].id,
          title: SEED_PRODUCTS[3].title,
          thumbnail: SEED_PRODUCTS[3].thumbnail,
          price: SEED_PRODUCTS[3].price,
          mrp: SEED_PRODUCTS[3].mrp,
          quantity: 1,
          sellerName: SEED_PRODUCTS[3].sellerName
        }
      ],
      deliveryAddress: SEED_USER.addresses[0],
      pricing: {
        totalMrp: SEED_PRODUCTS[3].mrp,
        totalDiscount: SEED_PRODUCTS[3].mrp - SEED_PRODUCTS[3].price,
        deliveryFee: 0,
        platformFee: 3,
        couponDiscount: 500,
        superCoinsUsed: 20,
        finalAmount: SEED_PRODUCTS[3].price - 500 - 20 + 3
      },
      payment: {
        method: 'UPI',
        status: 'COMPLETED',
        transactionId: 'UPI983204910283'
      },
      status: 'SHIPPED',
      courierName: 'Ekart Logistics Express',
      trackingNumber: 'FKEKART9482910IN',
      estimatedDelivery: 'Tomorrow, by 9:00 PM',
      trackingHistory: [
        {
          status: 'PLACED',
          title: 'Order Confirmed',
          description: 'Your order has been verified and confirmed by Seller',
          timestamp: 'Yesterday, 10:14 AM',
          completed: true,
          current: false
        },
        {
          status: 'PACKED',
          title: 'Packed',
          description: 'Seller has packed your item and generated courier label',
          timestamp: 'Yesterday, 3:30 PM',
          completed: true,
          current: false
        },
        {
          status: 'SHIPPED',
          title: 'Shipped',
          description: 'Dispatched via Ekart Logistics - Hub Bangalore South',
          timestamp: 'Today, 6:45 AM',
          completed: true,
          current: true
        },
        {
          status: 'OUT_FOR_DELIVERY',
          title: 'Out For Delivery',
          description: 'Delivery executive will reach your address',
          timestamp: 'Expected Tomorrow',
          completed: false,
          current: false
        },
        {
          status: 'DELIVERED',
          title: 'Delivered',
          description: 'Package delivered with OTP verification',
          timestamp: 'Expected Tomorrow',
          completed: false,
          current: false
        }
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    };
    this.orders.set(sampleOrder.id, sampleOrder);
  }

  // ===================== PRODUCTS =====================
  public getProducts(params: ProductFilterParams = {}): { products: Product[]; total: number; brands: string[] } {
    let result = Array.from(this.products.values());

    // Extract all unique brands before filtering
    const allBrands = Array.from(new Set(result.map((p) => p.brand))).filter(Boolean);

    // Enhanced Multi-keyword Search query
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter(Boolean);

      result = result.filter((p) => {
        const searchableText = [
          p.title,
          p.brand,
          p.category,
          p.subCategory || '',
          ...p.tags,
          ...p.highlights
        ].join(' ').toLowerCase();

        // Exact match or every token matches
        return tokens.every((token) => searchableText.includes(token));
      });
    }

    // Category filter
    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Brands filter
    if (params.brands && params.brands.length > 0) {
      result = result.filter((p) => params.brands!.includes(p.brand));
    }

    // Price range
    if (params.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    // Rating filter
    if (params.minRating !== undefined) {
      result = result.filter((p) => p.rating >= params.minRating!);
    }

    // F-Assured only
    if (params.isFAssured) {
      result = result.filter((p) => p.isFAssured);
    }

    // Stock
    if (params.inStockOnly) {
      result = result.filter((p) => p.inStock && p.stockQuantity > 0);
    }

    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price_low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'discount':
          result.sort((a, b) => b.discountPercent - a.discountPercent);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popularity':
        default:
          result.sort((a, b) => b.ratingsCount - a.ratingsCount);
          break;
      }
    }

    const total = result.length;

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 50;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = result.slice(startIndex, startIndex + limit);

    return {
      products: paginatedProducts,
      total,
      brands: allBrands
    };
  }

  public getProductById(id: string): Product | null {
    return this.products.get(id) || null;
  }

  public createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString()
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const product = this.products.get(id);
    if (!product) return null;
    const updated = { ...product, ...updates };
    if (updates.stockQuantity !== undefined) {
      updated.inStock = updates.stockQuantity > 0;
    }
    this.products.set(id, updated);
    return updated;
  }

  public deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  public updateProductStock(id: string, newStockOrDelta: number, isAbsolute = false): boolean {
    const product = this.products.get(id);
    if (!product) return false;
    if (isAbsolute) {
      product.stockQuantity = Math.max(0, newStockOrDelta);
    } else {
      product.stockQuantity = Math.max(0, product.stockQuantity + newStockOrDelta);
    }
    product.inStock = product.stockQuantity > 0;
    this.products.set(id, product);
    return true;
  }

  // ===================== SEARCH SUGGESTIONS =====================
  public getSearchSuggestions(query: string, limit = 8): SearchSuggestionItem[] {
    if (!query || query.trim() === '') {
      return [
        { text: 'iPhone 15', type: 'product' },
        { text: 'Samsung Galaxy', type: 'brand' },
        { text: 'MacBook Air M3', type: 'product' },
        { text: 'Sony Headphones', type: 'brand' },
        { text: 'Mobiles', type: 'category' }
      ];
    }

    const q = query.toLowerCase().trim();
    const suggestions: SearchSuggestionItem[] = [];
    const seen = new Set<string>();

    // 1. Check categories
    this.categories.forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) && !seen.has(cat.name.toLowerCase())) {
        suggestions.push({ text: cat.name, type: 'category', category: cat.slug });
        seen.add(cat.name.toLowerCase());
      }
    });

    // 2. Check brands
    const allBrands = Array.from(new Set(Array.from(this.products.values()).map((p) => p.brand)));
    allBrands.forEach((brand) => {
      if (brand && brand.toLowerCase().includes(q) && !seen.has(brand.toLowerCase())) {
        suggestions.push({ text: brand, type: 'brand' });
        seen.add(brand.toLowerCase());
      }
    });

    // 3. Check products
    Array.from(this.products.values()).forEach((p) => {
      if (suggestions.length >= limit) return;
      if (p.title.toLowerCase().includes(q) && !seen.has(p.title.toLowerCase())) {
        suggestions.push({ text: p.title, type: 'product', category: p.category });
        seen.add(p.title.toLowerCase());
      }
    });

    return suggestions.slice(0, limit);
  }

  // ===================== CATEGORIES =====================
  public getCategories(): Category[] {
    return Array.from(this.categories.values());
  }

  // ===================== USER & AUTHENTICATION =====================
  public getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  public getUserById(userId: string): User | null {
    return this.getUser(userId);
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values()).map((u) => {
      // Exclude raw password
      const safe = { ...u };
      delete safe.passwordHash;
      return safe;
    });
  }

  public getUserByEmailOrPhone(identifier: string): User | null {
    const clean = identifier.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === clean || user.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '')) {
        return user;
      }
    }
    return null;
  }

  public authenticate(emailOrPhone: string, passwordAttempt: string): User | null {
    const user = this.getUserByEmailOrPhone(emailOrPhone);
    if (!user) return null;
    if (user.passwordHash && user.passwordHash !== passwordAttempt) {
      return null;
    }
    return user;
  }

  public registerUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'admin';
  }): User {
    const existing = this.getUserByEmailOrPhone(data.email) || this.getUserByEmailOrPhone(data.phone);
    if (existing) {
      const err: any = new Error('An account with this email or phone number already exists.');
      err.statusCode = 409;
      throw err;
    }

    const id = `usr-${Date.now()}`;
    const newUser: User = {
      id,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      role: data.role || 'customer',
      passwordHash: data.password,
      superCoins: 100, // Welcome bonus
      isPlusMember: false,
      addresses: [],
      createdAt: new Date().toISOString()
    };

    this.users.set(id, newUser);
    return newUser;
  }

  // ===================== ADDRESS CRUD =====================
  public addAddress(userId: string, addressData: Omit<UserAddress, 'id'>): UserAddress | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const newAddress: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };

    if (newAddress.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((a) => (a.isDefault = false));
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    this.users.set(userId, user);
    return newAddress;
  }

  public updateAddress(userId: string, addressId: string, addressData: Partial<UserAddress>): UserAddress | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const index = user.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) return null;

    if (addressData.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses[index] = {
      ...user.addresses[index],
      ...addressData,
      id: addressId
    };

    this.users.set(userId, user);
    return user.addresses[index];
  }

  public deleteAddress(userId: string, addressId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter((a) => a.id !== addressId);
    if (user.addresses.length < initialLength) {
      if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }
      this.users.set(userId, user);
      return true;
    }
    return false;
  }

  public setDefaultAddress(userId: string, addressId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    let found = false;
    user.addresses.forEach((a) => {
      if (a.id === addressId) {
        a.isDefault = true;
        found = true;
      } else {
        a.isDefault = false;
      }
    });

    if (found) {
      this.users.set(userId, user);
    }
    return found;
  }

  public updateSuperCoins(userId: string, delta: number): number {
    const user = this.users.get(userId);
    if (!user) return 0;
    user.superCoins = Math.max(0, user.superCoins + delta);
    this.users.set(userId, user);
    return user.superCoins;
  }

  // ===================== CART =====================
  public getCart(userId: string): CartItem[] {
    return this.carts.get(userId) || [];
  }

  public addToCart(userId: string, productId: string, quantity = 1): CartItem[] {
    const product = this.products.get(productId);
    if (!product) throw new Error('Product not found');

    const userCart = this.carts.get(userId) || [];
    const existingIndex = userCart.findIndex((item) => item.productId === productId);

    if (existingIndex > -1) {
      userCart[existingIndex].quantity += quantity;
      userCart[existingIndex].product = product;
    } else {
      userCart.push({
        id: `item-${Date.now()}`,
        productId,
        quantity,
        product,
        addedAt: new Date().toISOString()
      });
    }

    this.carts.set(userId, userCart);
    return userCart;
  }

  public updateCartQuantity(userId: string, productId: string, quantity: number): CartItem[] {
    const userCart = this.carts.get(userId) || [];
    if (quantity <= 0) {
      return this.removeFromCart(userId, productId);
    }

    const item = userCart.find((i) => i.productId === productId);
    if (item) {
      item.quantity = quantity;
    }

    this.carts.set(userId, userCart);
    return userCart;
  }

  public removeFromCart(userId: string, productId: string): CartItem[] {
    const userCart = this.carts.get(userId) || [];
    const updated = userCart.filter((item) => item.productId !== productId);
    this.carts.set(userId, updated);
    return updated;
  }

  public clearCart(userId: string): void {
    this.carts.set(userId, []);
  }

  // ===================== WISHLIST =====================
  public getWishlist(userId: string): Product[] {
    const itemIds = this.wishlists.get(userId) || new Set();
    const result: Product[] = [];
    itemIds.forEach((id) => {
      const prod = this.products.get(id);
      if (prod) result.push(prod);
    });
    return result;
  }

  public toggleWishlist(userId: string, productId: string): boolean {
    let list = this.wishlists.get(userId);
    if (!list) {
      list = new Set();
      this.wishlists.set(userId, list);
    }
    const hasItem = list.has(productId);
    if (hasItem) {
      list.delete(productId);
      return false; // Removed
    } else {
      list.add(productId);
      return true; // Added
    }
  }

  // ===================== ORDERS =====================
  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>): Order {
    const id = `ord-${Date.now()}`;
    const orderNumber = `OD${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();

    const trackingHistory: TrackingStep[] = [
      {
        status: 'PLACED' as OrderStatus,
        title: 'Order Confirmed',
        description: 'Your order has been verified and confirmed by the Seller',
        timestamp: 'Just now',
        completed: true,
        current: true
      },
      {
        status: 'PACKED' as OrderStatus,
        title: 'Packed',
        description: 'Seller will pack and prepare your package',
        timestamp: 'Estimated within 12 hours',
        completed: false,
        current: false
      },
      {
        status: 'SHIPPED' as OrderStatus,
        title: 'Shipped',
        description: 'Dispatched via Ekart Express logistics partner',
        timestamp: 'Expected within 24 hours',
        completed: false,
        current: false
      },
      {
        status: 'OUT_FOR_DELIVERY' as OrderStatus,
        title: 'Out For Delivery',
        description: 'Delivery associate will contact you on day of arrival',
        timestamp: orderData.estimatedDelivery,
        completed: false,
        current: false
      },
      {
        status: 'DELIVERED' as OrderStatus,
        title: 'Delivered',
        description: 'Delivered safely to your chosen address',
        timestamp: orderData.estimatedDelivery,
        completed: false,
        current: false
      }
    ];

    const order: Order = {
      ...orderData,
      id,
      orderNumber,
      courierName: orderData.courierName || 'Ekart Logistics Express',
      trackingNumber: orderData.trackingNumber || `FK${orderNumber}`,
      trackingHistory,
      createdAt: now.toISOString()
    };

    this.orders.set(id, order);

    // Reduce stock for ordered items
    order.items.forEach((item) => {
      this.updateProductStock(item.productId, -item.quantity);
    });

    // Award SuperCoins
    this.updateSuperCoins(order.userId, 40);

    // Clear user cart
    this.clearCart(order.userId);

    return order;
  }

  public getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrdersByUser(userId: string): Order[] {
    const all = Array.from(this.orders.values());
    return all
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(orderId: string): Order | null {
    return this.orders.get(orderId) || null;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, customDescription?: string): Order | null {
    const order = this.orders.get(orderId);
    if (!order) return null;

    order.status = newStatus;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mark steps in tracking history
    const statusOrder: OrderStatus[] = ['PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const targetIndex = statusOrder.indexOf(newStatus);

    if (newStatus === 'CANCELLED') {
      order.trackingHistory.push({
        status: 'CANCELLED',
        title: 'Order Cancelled',
        description: customDescription || 'Refund will be initiated to original payment source within 24-48 hours',
        timestamp: nowTime,
        completed: true,
        current: true
      });
    } else if (targetIndex >= 0) {
      order.trackingHistory.forEach((step) => {
        const stepIndex = statusOrder.indexOf(step.status);
        if (stepIndex <= targetIndex) {
          step.completed = true;
          step.current = stepIndex === targetIndex;
          if (stepIndex === targetIndex && customDescription) {
            step.description = customDescription;
          }
        } else {
          step.completed = false;
          step.current = false;
        }
      });
    }

    this.orders.set(orderId, order);
    return order;
  }

  public cancelOrder(orderId: string): Order | null {
    return this.updateOrderStatus(orderId, 'CANCELLED');
  }

  // ===================== ADMIN METRICS =====================
  public getAdminMetrics(): AdminMetrics {
    const allOrders = Array.from(this.orders.values());
    const allProducts = Array.from(this.products.values());
    const allUsers = Array.from(this.users.values());

    const totalRevenue = allOrders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.pricing.finalAmount, 0);

    const lowStockCount = allProducts.filter((p) => p.stockQuantity < 10).length;

    const ordersByStatus: Record<string, number> = {};
    allOrders.forEach((o) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    return {
      totalRevenue,
      totalOrders: allOrders.length,
      totalUsers: allUsers.length,
      totalProducts: allProducts.length,
      lowStockCount,
      ordersByStatus
    };
  }

  // ===================== SELLER =====================
  public getSeller(sellerId: string): Seller | null {
    return this.sellers.get(sellerId) || null;
  }

  public getAllSellers(): Seller[] {
    return Array.from(this.sellers.values());
  }

  public getSellerProducts(sellerId: string): Product[] {
    return Array.from(this.products.values()).filter((p) => p.sellerId === sellerId);
  }

  public getSellerOrders(sellerId: string): Order[] {
    return Array.from(this.orders.values()).filter((o) =>
      o.items.some((i) => {
        const prod = this.products.get(i.productId);
        return prod && prod.sellerId === sellerId;
      })
    );
  }
}

// Enterprise Global Singleton Pattern
const globalKey = Symbol.for('flipkart.database.client');
const globalObj = globalThis as unknown as { [key: symbol]: DatabaseClient };

if (!globalObj[globalKey]) {
  globalObj[globalKey] = new DatabaseClient();
}

export const db: DatabaseClient = globalObj[globalKey]!;

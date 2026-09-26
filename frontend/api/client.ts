/**
 * Frontend API Client
 * Clean HTTP client for interacting with MNC Backend endpoints (/api/*)
 */
import {
  Product,
  Category,
  User,
  UserAddress,
  Order,
  OrderStatus,
  ProductFilterParams,
  CartCalculation,
  SearchSuggestionItem,
  AdminMetrics
} from '../types';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  // Retrieve token/session if saved
  const token = typeof window !== 'undefined' ? localStorage.getItem('fk_token') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('fk_user_id') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {})
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (userId) headers['x-user-id'] = userId;

  const res = await fetch(url, {
    ...options,
    headers
  });

  let json: any = {};
  try {
    json = await res.json();
  } catch (parseErr) {
    throw new Error(`Server returned status ${res.status}`);
  }

  if (!res.ok || !json.success) {
    const msg = json.error?.message || `Request failed with status ${res.status}`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.code = json.error?.code;
    throw err;
  }

  return json.data;
}

export const apiClient = {
  // Auth
  async login(payload: { emailOrPhone: string; password: string }) {
    return fetchJson<{ user: User; token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async register(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'admin';
  }) {
    return fetchJson<{ user: User; token: string; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getMe(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return fetchJson<User>(`/api/auth/me${query}`);
  },

  async logout() {
    return fetchJson<{ message: string }>('/api/auth/logout', {
      method: 'POST'
    });
  },

  // Products
  async getProducts(params: ProductFilterParams = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
    if (params.minRating !== undefined) query.set('minRating', params.minRating.toString());
    if (params.brands && params.brands.length > 0) query.set('brands', params.brands.join(','));
    if (params.isFAssured) query.set('isFAssured', 'true');
    if (params.inStockOnly) query.set('inStockOnly', 'true');
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    return fetchJson<{ products: Product[]; total: number; brands: string[] }>(
      `/api/products?${query.toString()}`
    );
  },

  async getSearchSuggestions(q: string, limit = 8) {
    const query = new URLSearchParams({ q, limit: limit.toString() });
    return fetchJson<SearchSuggestionItem[]>(`/api/products/suggestions?${query.toString()}`);
  },

  async getProductById(id: string) {
    return fetchJson<{ product: Product; related: Product[] }>(`/api/products/${id}`);
  },

  async getCategories() {
    return fetchJson<Category[]>('/api/categories');
  },

  async getDealsOfTheDay() {
    return fetchJson<Product[]>('/api/products/deals');
  },

  async createProduct(productData: any) {
    return fetchJson<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id: string, updates: any) {
    return fetchJson<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(id: string) {
    return fetchJson<{ deleted: boolean; id: string }>(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },

  async updateProductStock(id: string, stock: number) {
    return fetchJson<{ success: boolean; id: string; stock: number }>(`/api/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock })
    });
  },

  // Cart
  async getCart(userId = 'usr-default', coupon?: string, useSuperCoins?: boolean) {
    const query = new URLSearchParams({ userId });
    if (coupon) query.set('coupon', coupon);
    if (useSuperCoins) query.set('useSuperCoins', 'true');
    return fetchJson<CartCalculation>(`/api/cart?${query.toString()}`);
  },

  async addToCart(productId: string, quantity = 1, userId = 'usr-default') {
    return fetchJson<CartCalculation>('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity })
    });
  },

  async updateCartQuantity(productId: string, quantity: number, userId = 'usr-default') {
    return fetchJson<CartCalculation>('/api/cart/update', {
      method: 'POST',
      body: JSON.stringify({ userId, productId, quantity })
    });
  },

  async removeFromCart(productId: string, userId = 'usr-default') {
    return fetchJson<CartCalculation>('/api/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ userId, productId })
    });
  },

  // Orders & Checkout
  async checkout(payload: {
    userId?: string;
    addressId: string;
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'EMI';
    couponCode?: string;
    useSuperCoins?: boolean;
  }) {
    return fetchJson<Order>('/api/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getOrders(userId = 'usr-default') {
    return fetchJson<Order[]>(`/api/orders?userId=${userId}`);
  },

  async getOrderById(orderId: string) {
    return fetchJson<Order>(`/api/orders/${orderId}`);
  },

  async cancelOrder(orderId: string) {
    return fetchJson<Order>(`/api/orders/${orderId}/cancel`, {
      method: 'POST'
    });
  },

  // User, Address & Wishlist
  async getUserProfile(userId = 'usr-default') {
    return fetchJson<User>(`/api/user/profile?userId=${userId}`);
  },

  async addAddress(address: Omit<UserAddress, 'id'>, userId = 'usr-default') {
    return fetchJson<UserAddress>('/api/user/address', {
      method: 'POST',
      body: JSON.stringify({ userId, address })
    });
  },

  async updateAddress(addressId: string, address: Partial<UserAddress>, userId = 'usr-default') {
    return fetchJson<UserAddress>(`/api/user/address/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify({ userId, address })
    });
  },

  async deleteAddress(addressId: string, userId = 'usr-default') {
    return fetchJson<{ deleted: boolean; id: string }>(`/api/user/address/${addressId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId })
    });
  },

  async setDefaultAddress(addressId: string, userId = 'usr-default') {
    return fetchJson<{ success: boolean; id: string }>(`/api/user/address/${addressId}/default`, {
      method: 'PATCH',
      body: JSON.stringify({ userId })
    });
  },

  async getWishlist(userId = 'usr-default') {
    return fetchJson<Product[]>(`/api/user/wishlist?userId=${userId}`);
  },

  async toggleWishlist(productId: string, userId = 'usr-default') {
    return fetchJson<{ isSaved: boolean; wishlist: Product[] }>('/api/user/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ userId, productId })
    });
  },

  // Seller Hub
  async getSellerDashboard(sellerId = 'seller-retailnet') {
    return fetchJson<any>(`/api/seller/dashboard?sellerId=${sellerId}`);
  },

  async addSellerProduct(payload: any) {
    return fetchJson<Product>('/api/seller/products', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Admin Hub
  async getAdminMetrics() {
    return fetchJson<AdminMetrics>('/api/admin/metrics');
  },

  async getAdminOrders() {
    return fetchJson<Order[]>('/api/admin/orders');
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, description?: string) {
    return fetchJson<Order>(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, description })
    });
  },

  async getAdminUsers() {
    return fetchJson<User[]>('/api/admin/users');
  },

  // AI Assistant
  async askAiAssistant(query: string) {
    return fetchJson<{ reply: string; suggestedProductIds?: string[] }>('/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }
};

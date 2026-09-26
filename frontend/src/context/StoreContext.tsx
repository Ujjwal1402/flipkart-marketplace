/**
 * Global Store Context
 * Centralized State Management for Flipkart Marketplace
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  User,
  UserAddress,
  Order,
  OrderStatus,
  CartCalculation,
  ProductFilterParams,
  ActiveModal
} from '../types';
import { apiClient } from '../api/client';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  user: User | null;
  categories: Category[];
  cart: CartCalculation | null;
  wishlist: Product[];
  orders: Order[];
  deals: Product[];
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  activeModal: ActiveModal;
  filters: ProductFilterParams;
  availableBrands: string[];
  couponCode: string;
  useSuperCoins: boolean;
  toasts: ToastNotification[];
  isLoading: boolean;

  // Actions
  setFilters: React.Dispatch<React.SetStateAction<ProductFilterParams>>;
  setActiveModal: (modal: ActiveModal) => void;
  setSelectedProduct: (prod: Product | null) => void;
  setSelectedOrder: (order: Order | null) => void;
  setCouponCode: (coupon: string) => void;
  setUseSuperCoins: (val: boolean) => void;

  // Auth Actions
  login: (emailOrPhone: string, password: string) => Promise<User>;
  register: (payload: { name: string; email: string; phone: string; password: string; role?: 'customer' | 'admin' }) => Promise<User>;
  logout: () => Promise<void>;
  requireAuth: (action: () => void, targetModal?: ActiveModal) => boolean;

  // Cart Actions
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;

  // Wishlist Actions
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;

  // Checkout & Order Actions
  placeOrder: (addressId: string, paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'EMI') => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;

  // Address CRUD
  addNewAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;

  // Admin Actions
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus, description?: string) => Promise<void>;
  adminUpdateStock: (productId: string, stock: number) => Promise<void>;
  adminDeleteProduct: (productId: string) => Promise<void>;

  // Refreshers
  refreshCart: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshUser: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartCalculation | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [pendingModalAfterAuth, setPendingModalAfterAuth] = useState<ActiveModal>(null);

  const [couponCode, setCouponCode] = useState<string>('');
  const [useSuperCoins, setUseSuperCoins] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState<ProductFilterParams>({
    category: 'all',
    search: '',
    sortBy: 'popularity',
    page: 1,
    limit: 50
  });

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const currentUserId = user?.id || 'usr-default';

  const refreshUser = useCallback(async (uId?: string) => {
    const targetId = uId || localStorage.getItem('fk_user_id') || 'usr-default';
    try {
      const u = await apiClient.getUserProfile(targetId);
      setUser(u);
      localStorage.setItem('fk_user_id', u.id);
    } catch (err) {
      console.error('Failed to load user profile', err);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const targetId = user?.id || localStorage.getItem('fk_user_id') || 'usr-default';
      const c = await apiClient.getCart(targetId, couponCode, useSuperCoins);
      setCart(c);
    } catch (err) {
      console.error('Failed to refresh cart', err);
    }
  }, [user?.id, couponCode, useSuperCoins]);

  const refreshWishlist = useCallback(async () => {
    try {
      const targetId = user?.id || localStorage.getItem('fk_user_id') || 'usr-default';
      const w = await apiClient.getWishlist(targetId);
      setWishlist(w);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    }
  }, [user?.id]);

  const refreshOrders = useCallback(async () => {
    try {
      const targetId = user?.id || localStorage.getItem('fk_user_id') || 'usr-default';
      const ords = await apiClient.getOrders(targetId);
      setOrders(ords);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const savedUserId = localStorage.getItem('fk_user_id') || 'usr-default';
        const [cats, dealsData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getDealsOfTheDay(),
          refreshUser(savedUserId),
          refreshCart(),
          refreshWishlist(),
          refreshOrders()
        ]);
        setCategories(cats);
        setDeals(dealsData);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [refreshCart, refreshOrders, refreshUser, refreshWishlist]);

  // Re-fetch cart when coupon or superCoins toggle changes
  useEffect(() => {
    refreshCart();
  }, [couponCode, useSuperCoins, refreshCart]);

  // Auth Guards
  const requireAuth = (action: () => void, targetModal?: ActiveModal): boolean => {
    if (!user) {
      showToast('Please sign in to access this feature', 'info');
      setPendingModalAfterAuth(targetModal || null);
      setActiveModal('auth');
      return false;
    }
    action();
    return true;
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const res = await apiClient.login({ emailOrPhone, password });
      setUser(res.user);
      localStorage.setItem('fk_user_id', res.user.id);
      localStorage.setItem('fk_token', res.token);
      showToast(res.message || 'Logged in successfully!', 'success');

      // Re-fetch user scoped data
      await Promise.all([
        refreshCart(),
        refreshOrders(),
        refreshWishlist()
      ]);

      if (pendingModalAfterAuth) {
        setActiveModal(pendingModalAfterAuth);
        setPendingModalAfterAuth(null);
      } else {
        setActiveModal(null);
      }

      return res.user;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'admin';
  }) => {
    try {
      const res = await apiClient.register(payload);
      setUser(res.user);
      localStorage.setItem('fk_user_id', res.user.id);
      localStorage.setItem('fk_token', res.token);
      showToast(res.message || 'Account created successfully!', 'success');

      await Promise.all([
        refreshCart(),
        refreshOrders(),
        refreshWishlist()
      ]);

      if (pendingModalAfterAuth) {
        setActiveModal(pendingModalAfterAuth);
        setPendingModalAfterAuth(null);
      } else {
        setActiveModal(null);
      }

      return res.user;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('fk_token');
    localStorage.removeItem('fk_user_id');
    setUser(null);
    showToast('Signed out of Flipkart. You are now browsing as Guest.', 'info');
  };

  // Cart actions
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const targetId = user?.id || 'usr-default';
      const updated = await apiClient.addToCart(productId, quantity, targetId);
      setCart(updated);
      showToast('Item added to your Flipkart Cart!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add item to cart', 'error');
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    try {
      const targetId = user?.id || 'usr-default';
      const updated = await apiClient.updateCartQuantity(productId, quantity, targetId);
      setCart(updated);
    } catch (err: any) {
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const targetId = user?.id || 'usr-default';
      const updated = await apiClient.removeFromCart(productId, targetId);
      setCart(updated);
      showToast('Item removed from cart', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  // Wishlist actions
  const toggleWishlist = async (productId: string) => {
    try {
      const targetId = user?.id || 'usr-default';
      const res = await apiClient.toggleWishlist(productId, targetId);
      setWishlist(res.wishlist);
      showToast(
        res.isSaved ? 'Saved to your Wishlist!' : 'Removed from Wishlist',
        res.isSaved ? 'success' : 'info'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update wishlist', 'error');
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Orders
  const placeOrder = async (
    addressId: string,
    paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'EMI'
  ) => {
    const targetId = user?.id || 'usr-default';
    const order = await apiClient.checkout({
      userId: targetId,
      addressId,
      paymentMethod,
      couponCode: couponCode || undefined,
      useSuperCoins
    });
    await Promise.all([refreshCart(), refreshOrders(), refreshUser(targetId)]);
    showToast(`Order #${order.orderNumber} placed successfully!`, 'success');
    return order;
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await apiClient.cancelOrder(orderId);
      await refreshOrders();
      showToast('Order cancelled successfully. Refund initiated to source.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel order', 'error');
    }
  };

  // Address CRUD
  const addNewAddress = async (address: Omit<UserAddress, 'id'>) => {
    try {
      const targetId = user?.id || 'usr-default';
      await apiClient.addAddress(address, targetId);
      await refreshUser(targetId);
      showToast('New delivery address saved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save address', 'error');
      throw err;
    }
  };

  const updateAddress = async (addressId: string, address: Partial<UserAddress>) => {
    try {
      const targetId = user?.id || 'usr-default';
      await apiClient.updateAddress(addressId, address, targetId);
      await refreshUser(targetId);
      showToast('Address updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update address', 'error');
      throw err;
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const targetId = user?.id || 'usr-default';
      await apiClient.deleteAddress(addressId, targetId);
      await refreshUser(targetId);
      showToast('Address removed from address book', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete address', 'error');
      throw err;
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      const targetId = user?.id || 'usr-default';
      await apiClient.setDefaultAddress(addressId, targetId);
      await refreshUser(targetId);
      showToast('Default delivery address updated', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to set default address', 'error');
      throw err;
    }
  };

  // Admin Actions
  const adminUpdateOrderStatus = async (orderId: string, status: OrderStatus, description?: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, status, description);
      await refreshOrders();
      showToast(`Order status updated to ${status}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
      throw err;
    }
  };

  const adminUpdateStock = async (productId: string, stock: number) => {
    try {
      await apiClient.updateProductStock(productId, stock);
      showToast('Stock level updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
      throw err;
    }
  };

  const adminDeleteProduct = async (productId: string) => {
    try {
      await apiClient.deleteProduct(productId);
      showToast('Product removed from catalog', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
      throw err;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        categories,
        cart,
        wishlist,
        orders,
        deals,
        selectedProduct,
        selectedOrder,
        activeModal,
        filters,
        availableBrands,
        couponCode,
        useSuperCoins,
        toasts,
        isLoading,
        setFilters,
        setActiveModal,
        setSelectedProduct,
        setSelectedOrder,
        setCouponCode,
        setUseSuperCoins,
        login,
        register,
        logout,
        requireAuth,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        toggleWishlist,
        isWishlisted,
        placeOrder,
        cancelOrder,
        addNewAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        adminUpdateOrderStatus,
        adminUpdateStock,
        adminDeleteProduct,
        refreshCart,
        refreshOrders,
        refreshUser,
        showToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

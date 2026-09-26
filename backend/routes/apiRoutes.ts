/**
 * Centralized API Router
 * All REST endpoints prefixed under /api
 */
import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { CartController } from '../controllers/cartController';
import { OrderController } from '../controllers/orderController';
import { SellerController } from '../controllers/sellerController';
import { AiController } from '../controllers/aiController';
import { AuthController } from '../controllers/authController';
import { AdminController } from '../controllers/adminController';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'Flipkart Enterprise' });
});

// Authentication routes
apiRouter.post('/auth/login', AuthController.login);
apiRouter.post('/auth/register', AuthController.register);
apiRouter.get('/auth/me', AuthController.getMe);
apiRouter.post('/auth/logout', AuthController.logout);

// Product routes
apiRouter.get('/products', ProductController.getProducts);
apiRouter.get('/products/deals', ProductController.getDealsOfTheDay);
apiRouter.get('/products/suggestions', ProductController.getSuggestions);
apiRouter.get('/products/:id', ProductController.getProductById);
apiRouter.post('/products', ProductController.createProduct);
apiRouter.put('/products/:id', ProductController.updateProduct);
apiRouter.delete('/products/:id', ProductController.deleteProduct);
apiRouter.patch('/products/:id/stock', ProductController.updateStock);
apiRouter.get('/categories', ProductController.getCategories);

// Cart routes
apiRouter.get('/cart', CartController.getCart);
apiRouter.post('/cart/add', CartController.addItem);
apiRouter.post('/cart/update', CartController.updateQuantity);
apiRouter.post('/cart/remove', CartController.removeItem);

// Order & User routes
apiRouter.post('/orders/checkout', OrderController.placeOrder);
apiRouter.get('/orders', OrderController.getUserOrders);
apiRouter.get('/orders/:id', OrderController.getOrderById);
apiRouter.post('/orders/:id/cancel', OrderController.cancelOrder);
apiRouter.get('/user/profile', OrderController.getUserProfile);
apiRouter.post('/user/address', OrderController.addUserAddress);
apiRouter.put('/user/address/:id', OrderController.updateUserAddress);
apiRouter.delete('/user/address/:id', OrderController.deleteUserAddress);
apiRouter.patch('/user/address/:id/default', OrderController.setDefaultAddress);
apiRouter.get('/user/wishlist', OrderController.getWishlist);
apiRouter.post('/user/wishlist/toggle', OrderController.toggleWishlist);

// Seller Hub routes
apiRouter.get('/seller/dashboard', SellerController.getDashboard);
apiRouter.post('/seller/products', SellerController.addProduct);

// Enterprise Admin Hub routes
apiRouter.get('/admin/metrics', AdminController.getMetrics);
apiRouter.get('/admin/orders', AdminController.getAllOrders);
apiRouter.patch('/admin/orders/:id/status', AdminController.updateOrderStatus);
apiRouter.get('/admin/users', AdminController.getAllUsers);

// AI Assistant
apiRouter.post('/ai/assistant', AiController.queryAssistant);

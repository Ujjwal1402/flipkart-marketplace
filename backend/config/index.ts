/**
 * Backend Application Configuration
 * Enterprise MNC E-Commerce Constants & Policies
 */
export const APP_CONFIG = {
  appName: 'Flipkart Marketplace Platform',
  version: '2.4.0',
  environment: process.env.NODE_ENV || 'development',
  port: 3000,
  marketplace: {
    freeDeliveryThreshold: 500, // INR (Orders above ₹500 get Free Delivery)
    standardDeliveryFee: 40, // INR
    platformFee: 3, // INR (Flipkart standard platform handling fee)
    superCoinEarnRatePer100: 2, // 2 SuperCoins per ₹100 spent
    maxSuperCoinsPerOrder: 50,
    superCoinValueInInr: 1, // 1 SuperCoin = ₹1
    availableCoupons: [
      { code: 'FLIPKART10', discountPercent: 10, maxDiscount: 1000, minCartValue: 1999 },
      { code: 'BIGBILLION', discountPercent: 15, maxDiscount: 2500, minCartValue: 4999 },
      { code: 'WELCOME50', flatDiscount: 50, minCartValue: 499 }
    ]
  }
};

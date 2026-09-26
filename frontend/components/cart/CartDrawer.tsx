/**
 * Flipkart Cart Modal & Price Details Breakdown
 */
import React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  Coins,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    user,
    activeModal,
    setActiveModal,
    updateCartQuantity,
    removeFromCart,
    couponCode,
    setCouponCode,
    useSuperCoins,
    setUseSuperCoins,
    toggleWishlist
  } = useStore();

  if (activeModal !== 'cart') return null;

  const items = cart?.items || [];

  const handleProceedToCheckout = () => {
    setActiveModal('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-cart-modal"
        className="bg-gray-100 w-full max-w-5xl rounded-md shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Cart Header */}
        <div className="bg-white px-4 sm:px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-bold text-gray-800">
              Flipkart Cart ({cart?.itemCount || 0})
            </span>
            <span className="hidden sm:inline-block text-xs text-gray-500">
              Deliver to: <strong>{user?.addresses[0]?.city || 'Bengaluru'} - {user?.addresses[0]?.pincode || '560103'}</strong>
            </span>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {items.length === 0 ? (
            <div className="bg-white rounded p-8 text-center max-w-md mx-auto my-8 shadow-xs">
              <div className="w-16 h-16 bg-blue-50 text-[#2874f0] rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Your Cart is empty!</h3>
              <p className="text-xs text-gray-500 mt-1 mb-5">
                Explore our best deals across smartphones, electronics, and fashion.
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded shadow-xs transition"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Cart Items List (8 cols) */}
              <div className="lg:col-span-8 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-4"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center p-1 bg-gray-50 rounded">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                            {item.product.title}
                          </h4>
                          {item.product.isFAssured && (
                            <span className="inline-flex items-center gap-0.5 bg-blue-50 text-[#2874f0] font-black text-[10px] px-1.5 py-0.2 rounded italic">
                              <Zap size={10} className="fill-[#2874f0]" /> F-Assured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">Seller: {item.product.sellerName}</p>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-base font-bold text-gray-900">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">
                            {item.product.discountPercent}% Off
                          </span>
                        </div>
                      </div>

                      {/* Controls: Quantity + Remove + Save for Later */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold">
                          <button
                            onClick={() => {
                              toggleWishlist(item.productId);
                              removeFromCart(item.productId);
                            }}
                            className="text-gray-600 hover:text-[#2874f0] uppercase tracking-wide cursor-pointer"
                          >
                            SAVE FOR LATER
                          </button>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-600 hover:text-red-600 uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={13} /> REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Price Details Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Coupons / Promo Box */}
                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs text-xs">
                  <div className="flex items-center gap-2 font-bold text-gray-800 mb-2">
                    <Tag size={15} className="text-[#2874f0]" />
                    <span>Apply Discount Coupon</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. BIGBILLION"
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded uppercase font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      onClick={() => setCouponCode(couponCode)}
                      className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded transition"
                    >
                      Apply
                    </button>
                  </div>
                  {cart?.appliedCoupon ? (
                    <p className="text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                      ✓ Coupon '{cart.appliedCoupon}' applied (-₹{cart.couponDiscount})
                    </p>
                  ) : (
                    <div className="mt-2 text-[11px] text-gray-500 flex gap-1">
                      <span>Available:</span>
                      <button
                        onClick={() => setCouponCode('BIGBILLION')}
                        className="text-[#2874f0] font-bold hover:underline"
                      >
                        BIGBILLION
                      </button>
                      <span>|</span>
                      <button
                        onClick={() => setCouponCode('FLIPKART10')}
                        className="text-[#2874f0] font-bold hover:underline"
                      >
                        FLIPKART10
                      </button>
                    </div>
                  )}
                </div>

                {/* SuperCoins Toggle */}
                {user && user.superCoins > 0 && (
                  <div className="bg-amber-50/70 p-3 rounded border border-amber-200 text-xs">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-amber-600 fill-amber-500" />
                        <div>
                          <p className="font-bold text-gray-900">
                            Pay with SuperCoins (Balance: {user.superCoins})
                          </p>
                          <p className="text-[11px] text-gray-600">Save ₹{Math.min(user.superCoins, 50)} on this order</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={useSuperCoins}
                        onChange={(e) => setUseSuperCoins(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {/* Price Details Card */}
                <div className="bg-white rounded border border-gray-200 shadow-xs overflow-hidden">
                  <div className="p-3.5 border-b border-gray-100 font-bold text-gray-500 text-xs uppercase tracking-wider">
                    PRICE DETAILS
                  </div>

                  <div className="p-4 space-y-3 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span>Price ({cart?.itemCount} items)</span>
                      <span>₹{cart?.totalMrp.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount on MRP</span>
                      <span>-₹{cart?.totalDiscount.toLocaleString('en-IN')}</span>
                    </div>

                    {cart?.couponDiscount ? (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Coupons For You</span>
                        <span>-₹{cart.couponDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    ) : null}

                    {cart?.superCoinsDeduction ? (
                      <div className="flex justify-between text-amber-600 font-semibold">
                        <span>SuperCoins Redemption</span>
                        <span>-₹{cart.superCoinsDeduction.toLocaleString('en-IN')}</span>
                      </div>
                    ) : null}

                    <div className="flex justify-between">
                      <span>Delivery Charges</span>
                      <span>
                        {cart?.deliveryFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `₹${cart?.deliveryFee}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Platform Fee</span>
                      <span>₹{cart?.platformFee}</span>
                    </div>

                    <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between font-extrabold text-sm text-gray-900">
                      <span>Total Amount</span>
                      <span>₹{cart?.finalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded font-bold text-xs text-center">
                      You will save ₹{cart?.totalSavings.toLocaleString('en-IN')} on this order!
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <button
                      id="btn-cart-place-order"
                      onClick={handleProceedToCheckout}
                      className="w-full bg-[#fb641b] hover:bg-[#e8560f] text-white font-extrabold py-3 rounded-xs uppercase tracking-wide shadow flex items-center justify-center gap-2 text-sm transition cursor-pointer"
                    >
                      <span>PLACE ORDER</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                  <ShieldCheck size={14} className="text-gray-400" />
                  <span>Safe and Secure Payments. 100% Authentic products.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

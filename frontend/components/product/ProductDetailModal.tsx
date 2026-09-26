/**
 * Flipkart Comprehensive Product Detail View Modal
 */
import React, { useState } from 'react';
import {
  X,
  Star,
  Zap,
  ShoppingCart,
  ZapOff,
  Truck,
  ShieldCheck,
  Tag,
  MapPin,
  CheckCircle2,
  Share2,
  Heart,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setActiveModal,
    toggleWishlist,
    isWishlisted,
    showToast
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pincode, setPincode] = useState('560103');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  if (!selectedProduct) return null;

  const saved = isWishlisted(selectedProduct.id);
  const images = selectedProduct.images.length > 0 ? selectedProduct.images : [selectedProduct.thumbnail];

  const handleBuyNow = async () => {
    await addToCart(selectedProduct.id, 1);
    setSelectedProduct(null);
    setActiveModal('checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeChecked(true);
      showToast(`Deliverable to ${pincode} by Tomorrow!`, 'success');
    } else {
      showToast('Please enter a valid 6-digit PIN code', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="product-detail-modal-container"
        className="bg-white w-full max-w-6xl rounded-md shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="font-semibold text-[#2874f0]">Home</span>
            <ChevronRight size={13} />
            <span className="capitalize">{selectedProduct.category}</span>
            <ChevronRight size={13} />
            <span className="font-medium text-gray-800 truncate max-w-xs">{selectedProduct.brand}</span>
          </div>
          <button
            id="btn-close-product-modal"
            onClick={() => setSelectedProduct(null)}
            className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Image Gallery & Buy Actions (5 cols) */}
            <div className="md:col-span-5 flex flex-col">
              {/* Main Image Display */}
              <div className="relative border border-gray-200 rounded p-4 h-72 sm:h-96 flex items-center justify-center bg-gray-50/50">
                <img
                  src={images[activeImageIndex] || selectedProduct.thumbnail}
                  alt={selectedProduct.title}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
                  }}
                />

                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition ${
                    saved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart size={20} className={saved ? 'fill-red-500' : ''} />
                </button>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 border-2 rounded p-1 flex items-center justify-center cursor-pointer transition ${
                        activeImageIndex === idx
                          ? 'border-[#2874f0] ring-1 ring-[#2874f0]'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Iconic Flipkart Buttons: ADD TO CART & BUY NOW */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  id="btn-modal-add-to-cart"
                  onClick={() => {
                    addToCart(selectedProduct.id, 1);
                  }}
                  className="bg-[#ff9f00] hover:bg-[#f39700] text-white font-extrabold py-3 px-4 rounded-xs shadow flex items-center justify-center gap-2 text-sm uppercase tracking-wide transition cursor-pointer"
                >
                  <ShoppingCart size={18} />
                  <span>ADD TO CART</span>
                </button>

                <button
                  id="btn-modal-buy-now"
                  onClick={handleBuyNow}
                  className="bg-[#fb641b] hover:bg-[#e8560f] text-white font-extrabold py-3 px-4 rounded-xs shadow flex items-center justify-center gap-2 text-sm uppercase tracking-wide transition cursor-pointer"
                >
                  <Zap size={18} className="fill-white" />
                  <span>BUY NOW</span>
                </button>
              </div>
            </div>

            {/* Right Column: Product Specs, Offers, Delivery (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              {/* Title & Brand */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {selectedProduct.brand}
                </p>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-snug mt-1">
                  {selectedProduct.title}
                </h1>
                {selectedProduct.subtitle && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{selectedProduct.subtitle}</p>
                )}
              </div>

              {/* Rating & Assured Badge */}
              <div className="flex items-center gap-3">
                <span className="bg-emerald-700 text-white font-bold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  {selectedProduct.rating} <Star size={11} className="fill-white" />
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  {selectedProduct.ratingsCount.toLocaleString('en-IN')} Ratings & {selectedProduct.reviewsCount.toLocaleString('en-IN')} Reviews
                </span>
                {selectedProduct.isFAssured && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-[#2874f0] font-black text-xs px-2 py-0.5 rounded italic">
                    <Zap size={12} className="fill-[#2874f0]" /> F-Assured
                  </span>
                )}
              </div>

              {/* Price & Savings */}
              <div className="bg-gray-50/60 p-3 rounded border border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base font-bold text-emerald-600">
                    {selectedProduct.discountPercent}% off
                  </span>
                </div>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Special Price • You save ₹{(selectedProduct.mrp - selectedProduct.price).toLocaleString('en-IN')} on this item
                </p>
              </div>

              {/* Available Bank Offers */}
              <div>
                <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag size={14} className="text-[#2874f0]" /> Available Bank Offers
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedProduct.bankOffers.map((offer) => (
                    <div key={offer.id} className="flex items-start gap-2 text-gray-700">
                      <Tag size={13} className="text-emerald-600 shrink-0 mt-0.5 fill-emerald-600" />
                      <span>
                        <strong className="text-gray-900">{offer.bankName}:</strong> {offer.discountDescription}{' '}
                        <span className="text-[#2874f0] font-semibold cursor-pointer">T&C</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery & Pincode Checker */}
              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <MapPin size={16} className="text-gray-500" />
                    <span>Delivery to:</span>
                  </div>

                  <form onSubmit={handlePincodeCheck} className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter Pincode"
                      className="w-32 px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="text-xs text-[#2874f0] font-bold hover:underline cursor-pointer"
                    >
                      Check
                    </button>
                  </form>
                </div>

                {pincodeChecked && (
                  <div className="mt-2 text-xs text-gray-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>
                      Delivery by <strong className="text-gray-900">Tomorrow, 11:00 PM</strong> |{' '}
                      <span className="text-emerald-600 font-bold">FREE</span>{' '}
                      <span className="line-through text-gray-400">₹40</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div>
                <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider mb-2">
                  Product Highlights
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700 list-disc list-inside">
                  {selectedProduct.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Specifications Table */}
              {selectedProduct.specifications.length > 0 && (
                <div className="border border-gray-200 rounded overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Specifications
                  </div>
                  <div className="divide-y divide-gray-100 text-xs">
                    {selectedProduct.specifications.map((specGroup, idx) => (
                      <div key={idx} className="p-3">
                        <span className="font-bold text-gray-900 text-xs block mb-1.5">
                          {specGroup.category}
                        </span>
                        <div className="space-y-1.5">
                          {specGroup.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="grid grid-cols-3 gap-2">
                              <span className="text-gray-500">{item.key}</span>
                              <span className="col-span-2 text-gray-900 font-medium">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Information */}
              <div className="bg-blue-50/40 p-3 rounded border border-blue-100 text-xs flex items-center justify-between">
                <div>
                  <span className="text-gray-500">Seller:</span>{' '}
                  <strong className="text-gray-900">{selectedProduct.sellerName}</strong>{' '}
                  <span className="bg-blue-600 text-white text-[10px] px-1 py-0.2 rounded font-bold">4.8★</span>
                </div>
                <div className="flex items-center gap-1 text-[#2874f0] font-semibold cursor-pointer">
                  <ShieldCheck size={14} /> 7 Days Replacement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Flipkart Standard Product Card
 */
import React from 'react';
import { Heart, Star, Zap, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { setSelectedProduct, addToCart, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(product.id);

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  if (layout === 'horizontal') {
    return (
      <div
        id={`product-card-horizontal-${product.id}`}
        onClick={handleCardClick}
        className="bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg transition p-4 rounded flex flex-col sm:flex-row gap-4 cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="relative w-full sm:w-48 h-44 shrink-0 flex items-center justify-center p-2 bg-gray-50/50 rounded">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
            }}
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-xs hover:bg-white transition ${
              saved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            title="Wishlist"
          >
            <Heart size={17} className={saved ? 'fill-red-500' : ''} />
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {product.brand}
              </span>
              {product.isFAssured && (
                <span className="inline-flex items-center gap-0.5 bg-blue-50 text-[#2874f0] font-black text-[10px] px-1.5 py-0.5 rounded italic">
                  <Zap size={11} className="fill-[#2874f0]" /> F-Assured
                </span>
              )}
            </div>

            <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-[#2874f0] line-clamp-2">
              {product.title}
            </h3>

            {/* Rating pill */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="bg-emerald-700 text-white font-bold text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                {product.rating} <Star size={10} className="fill-white" />
              </span>
              <span className="text-xs text-gray-500 font-medium">
                ({product.ratingsCount.toLocaleString('en-IN')})
              </span>
            </div>

            {/* Highlights */}
            <ul className="mt-2.5 space-y-1 text-xs text-gray-600 list-disc list-inside line-clamp-3">
              {product.highlights.slice(0, 3).map((h: string, i: number) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Pricing & CTA */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {product.discountPercent}% off
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Free delivery by Tomorrow</p>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 transition shadow-xs"
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="bg-white border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-200 rounded p-3 sm:p-4 flex flex-col justify-between cursor-pointer group relative"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 shadow-xs hover:bg-white transition ${
          saved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        }`}
        title={saved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        aria-label="Wishlist toggle"
      >
        <Heart size={16} className={saved ? 'fill-red-500' : ''} />
      </button>

      {/* Image container */}
      <div className="w-full h-44 sm:h-52 flex items-center justify-center p-2 mb-3 bg-gray-50/40 rounded overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {product.brand}
            </span>
            {product.isFAssured && (
              <span className="inline-flex items-center gap-0.5 bg-blue-50 text-[#2874f0] font-black text-[10px] px-1 py-0.5 rounded italic">
                <Zap size={10} className="fill-[#2874f0]" /> F-Assured
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-[#2874f0] line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="bg-emerald-700 text-white font-bold text-[11px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              {product.rating} <Star size={10} className="fill-white" />
            </span>
            <span className="text-[11px] text-gray-500">
              ({product.ratingsCount > 1000 ? `${(product.ratingsCount / 1000).toFixed(0)}k` : product.ratingsCount})
            </span>
          </div>
        </div>

        {/* Pricing & Add button */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] font-bold text-emerald-600">
              {product.discountPercent}% off
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 bg-blue-50 text-[#2874f0] hover:bg-[#2874f0] hover:text-white rounded transition shadow-xs cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Hero Banner Carousel & Promo Bar
 */
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, CreditCard, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const BANNERS = [
  {
    id: 1,
    title: 'THE BIG BILLION DAYS',
    subtitle: 'India Ka Apna Festival • Up to 80% Off on Top Brands',
    bgGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    tag: 'MEGA SALE LIVE',
    ctaText: 'Shop Electronics',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80'
  },
  {
    id: 2,
    title: 'Flagship Smartphone Bonanza',
    subtitle: 'iPhone 15, S24 Ultra & OnePlus 12R from ₹42,999 with No Cost EMI',
    bgGradient: 'from-amber-600 via-orange-700 to-stone-900',
    tag: 'EXTRA ₹2,000 EXCHANGE BONUS',
    ctaText: 'Explore Mobiles',
    category: 'mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80'
  },
  {
    id: 3,
    title: 'Autumn Fashion Carnival',
    subtitle: 'Nike, Puma, Levi’s & More | Minimum 40% - 70% Off',
    bgGradient: 'from-rose-600 via-pink-700 to-purple-900',
    tag: 'F-ASSURED QUALITY',
    ctaText: 'Shop Trends',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setFilters } = useStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = BANNERS[currentSlide];

  const handleBannerClick = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat, page: 1 }));
  };

  return (
    <div id="flipkart-hero-carousel-section" className="relative max-w-7xl mx-auto px-2 sm:px-6 pt-3">
      {/* Banner Card */}
      <div
        className={`relative overflow-hidden rounded-md shadow-md bg-gradient-to-r ${slide.bgGradient} text-white min-h-[190px] sm:min-h-[260px] flex items-center transition-all duration-500`}
      >
        <div className="relative z-10 w-full sm:w-3/5 p-5 sm:p-8 flex flex-col justify-center">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider mb-2 w-max">
            <Zap size={13} className="fill-blue-950" />
            {slide.tag}
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2 drop-shadow">
            {slide.title}
          </h2>

          <p className="text-xs sm:text-sm text-gray-200 mb-4 line-clamp-2 max-w-lg">
            {slide.subtitle}
          </p>

          <button
            id={`btn-carousel-cta-${slide.id}`}
            onClick={() => handleBannerClick(slide.category)}
            className="bg-white text-gray-900 hover:bg-yellow-300 hover:text-blue-950 font-bold text-xs sm:text-sm px-5 py-2 rounded-xs shadow-md transition w-max cursor-pointer"
          >
            {slide.ctaText} →
          </button>
        </div>

        {/* Hero Product Artwork */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 overflow-hidden opacity-40 sm:opacity-90">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 sm:from-transparent to-transparent pointer-events-none" />
        </div>

        {/* Carousel Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center rounded-r shadow transition cursor-pointer z-20"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/70 hover:bg-white text-gray-800 flex items-center justify-center rounded-l shadow transition cursor-pointer z-20"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Bank Partner Offers Ticker */}
      <div className="mt-2.5 bg-white border border-blue-100 rounded p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs text-gray-700">
        <div className="flex items-center gap-2 font-medium">
          <CreditCard size={16} className="text-[#2874f0]" />
          <span className="font-bold text-[#2874f0]">Bank Offers:</span>
          <span>10% Instant Discount on HDFC & ICICI Cards</span>
          <span className="hidden md:inline text-gray-400">|</span>
          <span className="hidden md:inline">5% Unlimited Cashback on Flipkart Axis Card</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
          <Tag size={13} />
          <span>USE COUPON: BIGBILLION</span>
        </div>
      </div>
    </div>
  );
};

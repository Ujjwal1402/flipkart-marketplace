/**
 * Deals of the Day & Best of Electronics Section
 */
import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Zap, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const DealSection: React.FC = () => {
  const { deals, setFilters } = useStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (num: number) => String(num).padStart(2, '0');

  const handleViewAllDeals = () => {
    setFilters((prev) => ({ ...prev, category: 'all', sortBy: 'discount', page: 1 }));
  };

  return (
    <div id="flipkart-deals-section" className="max-w-7xl mx-auto px-2 sm:px-6 mt-4 sm:mt-6">
      <div className="bg-white rounded-md shadow-xs border border-gray-200 overflow-hidden">
        {/* Deal Header Bar */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Zap size={22} className="fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  Deals of the Day
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                  <Award size={12} /> Big Billion Specials
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 font-medium">
                <Clock size={13} className="text-gray-400" />
                <span>Ends in</span>
                <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                  {formatDigits(timeLeft.hours)}h : {formatDigits(timeLeft.minutes)}m : {formatDigits(timeLeft.seconds)}s
                </span>
              </div>
            </div>
          </div>

          <button
            id="btn-view-all-deals"
            onClick={handleViewAllDeals}
            className="bg-[#2874f0] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <span>VIEW ALL</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Product Grid */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {deals.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

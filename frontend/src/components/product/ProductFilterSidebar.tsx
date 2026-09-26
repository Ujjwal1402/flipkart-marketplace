/**
 * Flipkart Product Facet Filter Sidebar
 */
import React from 'react';
import { Filter, Star, Zap, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FilterSidebarProps {
  availableBrands: string[];
}

export const ProductFilterSidebar: React.FC<FilterSidebarProps> = ({ availableBrands }) => {
  const { filters, setFilters, categories } = useStore();

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      brands: undefined,
      isFAssured: undefined,
      sortBy: 'popularity',
      page: 1
    });
  };

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const current = prev.brands || [];
      const updated = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      return { ...prev, brands: updated.length > 0 ? updated : undefined, page: 1 };
    });
  };

  const handleRatingSelect = (rating: number | undefined) => {
    setFilters((prev) => ({ ...prev, minRating: rating, page: 1 }));
  };

  const handleFAssuredToggle = () => {
    setFilters((prev) => ({ ...prev, isFAssured: !prev.isFAssured, page: 1 }));
  };

  const handlePricePreset = (min?: number, max?: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max, page: 1 }));
  };

  return (
    <aside id="product-filter-sidebar" className="bg-white rounded border border-gray-200 p-4 text-sm shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 font-bold text-gray-800 text-base">
          <Filter size={18} className="text-[#2874f0]" />
          <span>Filters</span>
        </div>
        <button
          onClick={handleClearFilters}
          className="text-xs text-[#2874f0] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} /> Clear All
        </button>
      </div>

      {/* Flipkart Assured Filter */}
      <div className="pb-3 border-b border-gray-100">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.isFAssured}
            onChange={handleFAssuredToggle}
            className="w-4 h-4 text-[#2874f0] rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="inline-flex items-center gap-1 bg-blue-50 text-[#2874f0] font-black text-xs px-2 py-0.5 rounded italic">
            <Zap size={12} className="fill-[#2874f0]" /> F-Assured
          </span>
        </label>
        <p className="text-[11px] text-gray-500 mt-1 pl-6">Only show verified quality items</p>
      </div>

      {/* Category Facet */}
      <div className="pb-3 border-b border-gray-100">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5">CATEGORIES</h4>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, category: 'all', page: 1 }))}
            className={`w-full text-left text-xs py-1 px-2 rounded transition flex items-center justify-between ${
              filters.category === 'all' || !filters.category
                ? 'bg-blue-50 text-[#2874f0] font-bold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.slug, page: 1 }))}
              className={`w-full text-left text-xs py-1 px-2 rounded transition flex items-center justify-between ${
                filters.category === cat.slug
                  ? 'bg-blue-50 text-[#2874f0] font-bold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Presets */}
      <div className="pb-3 border-b border-gray-100">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5">PRICE</h4>
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <button
            onClick={() => handlePricePreset(undefined, 2000)}
            className={`text-xs py-1 px-2 border rounded text-center transition ${
              filters.maxPrice === 2000
                ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Under ₹2,000
          </button>
          <button
            onClick={() => handlePricePreset(2000, 20000)}
            className={`text-xs py-1 px-2 border rounded text-center transition ${
              filters.minPrice === 2000 && filters.maxPrice === 20000
                ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            ₹2k - ₹20k
          </button>
          <button
            onClick={() => handlePricePreset(20000, 70000)}
            className={`text-xs py-1 px-2 border rounded text-center transition ${
              filters.minPrice === 20000 && filters.maxPrice === 70000
                ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            ₹20k - ₹70k
          </button>
          <button
            onClick={() => handlePricePreset(70000, undefined)}
            className={`text-xs py-1 px-2 border rounded text-center transition ${
              filters.minPrice === 70000
                ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] font-bold'
                : 'border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Above ₹70,000
          </button>
        </div>
      </div>

      {/* Customer Ratings */}
      <div className="pb-3 border-b border-gray-100">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5">
          CUSTOMER RATINGS
        </h4>
        <div className="space-y-1.5">
          {[4, 3].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer select-none text-xs">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => handleRatingSelect(r)}
                className="text-[#2874f0] focus:ring-blue-500"
              />
              <span className="flex items-center gap-1 font-semibold text-gray-700">
                {r} <Star size={11} className="fill-amber-400 text-amber-500" /> & above
              </span>
            </label>
          ))}
          {filters.minRating && (
            <button
              onClick={() => handleRatingSelect(undefined)}
              className="text-[11px] text-[#2874f0] hover:underline pt-1"
            >
              Reset rating filter
            </button>
          )}
        </div>
      </div>

      {/* Brand Filters */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5">BRAND</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableBrands.map((brand) => {
              const isChecked = filters.brands?.includes(brand) || false;
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer select-none text-xs hover:text-[#2874f0]"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-3.5 h-3.5 text-[#2874f0] rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className={isChecked ? 'font-bold text-[#2874f0]' : 'text-gray-700'}>
                    {brand}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

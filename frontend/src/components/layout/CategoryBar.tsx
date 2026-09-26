/**
 * Flipkart Category Navigation Ribbon
 */
import React from 'react';
import {
  Smartphone,
  Laptop,
  Shirt,
  Tv,
  Armchair,
  ShoppingBag,
  LayoutGrid
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategoryBar: React.FC = () => {
  const { categories, filters, setFilters, setSelectedProduct } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone size={22} className="text-blue-600" />;
      case 'Laptop':
        return <Laptop size={22} className="text-indigo-600" />;
      case 'Shirt':
        return <Shirt size={22} className="text-pink-600" />;
      case 'Tv':
        return <Tv size={22} className="text-amber-600" />;
      case 'Armchair':
        return <Armchair size={22} className="text-emerald-600" />;
      case 'ShoppingBag':
        return <ShoppingBag size={22} className="text-orange-600" />;
      default:
        return <LayoutGrid size={22} className="text-gray-600" />;
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedProduct(null);
    setFilters((prev) => ({
      ...prev,
      category: categorySlug,
      page: 1
    }));
  };

  return (
    <nav id="category-navigation-ribbon" className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-10 overflow-x-auto py-3 no-scrollbar">
          {/* All categories pill */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={`flex flex-col items-center gap-1 min-w-[64px] sm:min-w-[76px] cursor-pointer group transition ${
              filters.category === 'all' || !filters.category
                ? 'text-[#2874f0] font-bold'
                : 'text-gray-700 hover:text-[#2874f0]'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                filters.category === 'all' || !filters.category
                  ? 'bg-blue-50 ring-2 ring-[#2874f0]'
                  : 'bg-gray-50 group-hover:bg-blue-50'
              }`}
            >
              <LayoutGrid size={22} className={filters.category === 'all' ? 'text-[#2874f0]' : 'text-gray-600'} />
            </div>
            <span className="text-xs whitespace-nowrap">All Products</span>
          </button>

          {/* Dynamic categories from DB */}
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`flex flex-col items-center gap-1 min-w-[64px] sm:min-w-[76px] cursor-pointer group transition ${
                  isSelected ? 'text-[#2874f0] font-bold' : 'text-gray-700 hover:text-[#2874f0]'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                    isSelected
                      ? 'bg-blue-50 ring-2 ring-[#2874f0]'
                      : 'bg-gray-50 group-hover:bg-blue-50'
                  }`}
                >
                  {getIcon(cat.iconName)}
                </div>
                <span className="text-xs whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

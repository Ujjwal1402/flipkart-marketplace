/**
 * Flipkart E-Commerce Marketplace Application
 * MNC Separated Architecture: Frontend Module
 */
import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { CategoryBar } from './components/layout/CategoryBar';
import { HeroCarousel } from './components/home/HeroCarousel';
import { DealSection } from './components/home/DealSection';
import { ProductFilterSidebar } from './components/product/ProductFilterSidebar';
import { ProductCard } from './components/product/ProductCard';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { SellerPortalModal } from './components/seller/SellerPortalModal';
import { ShoppingAssistantModal } from './components/ai/ShoppingAssistantModal';
import { AuthModal } from './components/auth/AuthModal';
import { AdminPortalModal } from './components/admin/AdminPortalModal';
import { AddressManagerModal } from './components/address/AddressManagerModal';
import { ToastContainer } from './components/common/Toast';
import { Footer } from './components/layout/Footer';
import { apiClient } from './api/client';
import { Product } from './types';
import { LayoutGrid, List, ArrowUpDown, Loader2, PackageSearch } from 'lucide-react';

const MainMarketplaceContent: React.FC = () => {
  const { filters, setFilters } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await apiClient.getProducts(filters);
        if (!cancelled) {
          setProducts(res.products);
          setTotalCount(res.total);
          if (res.brands && res.brands.length > 0) {
            setAvailableBrands(res.brands);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const isBrowsingAll = (!filters.category || filters.category === 'all') && (!filters.search || filters.search.trim() === '');

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6] text-gray-800 font-sans">
      <Navbar />
      <CategoryBar />

      {/* Show Hero and Flash Deals only on the clean home view */}
      {isBrowsingAll && (
        <>
          <HeroCarousel />
          <DealSection />
        </>
      )}

      {/* Main Catalog View with Facet Filters */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Left: Filter Sidebar (3 cols on desktop) */}
          <div className="lg:col-span-3">
            <ProductFilterSidebar availableBrands={availableBrands} />
          </div>

          {/* Right: Products Listing (9 cols) */}
          <div className="lg:col-span-9 space-y-4">
            {/* Control Bar: Total Count & Sort By tabs */}
            <div className="bg-white p-3 sm:p-4 rounded border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">
                  {filters.category && filters.category !== 'all'
                    ? `${filters.category.toUpperCase()} (${totalCount})`
                    : filters.search
                    ? `Results for "${filters.search}" (${totalCount})`
                    : `All Products (${totalCount})`}
                </span>
              </div>

              {/* Flipkart Sort Options */}
              <div className="flex items-center gap-2 sm:gap-4 font-semibold text-gray-600">
                <span className="text-gray-400 font-bold hidden sm:inline flex items-center gap-1">
                  <ArrowUpDown size={12} /> Sort By:
                </span>

                <button
                  onClick={() => setFilters((p) => ({ ...p, sortBy: 'popularity', page: 1 }))}
                  className={`px-2 py-1 rounded transition cursor-pointer ${
                    filters.sortBy === 'popularity' || !filters.sortBy
                      ? 'text-[#2874f0] font-bold border-b-2 border-[#2874f0]'
                      : 'hover:text-[#2874f0]'
                  }`}
                >
                  Popularity
                </button>

                <button
                  onClick={() => setFilters((p) => ({ ...p, sortBy: 'price_low', page: 1 }))}
                  className={`px-2 py-1 rounded transition cursor-pointer ${
                    filters.sortBy === 'price_low'
                      ? 'text-[#2874f0] font-bold border-b-2 border-[#2874f0]'
                      : 'hover:text-[#2874f0]'
                  }`}
                >
                  Price -- Low to High
                </button>

                <button
                  onClick={() => setFilters((p) => ({ ...p, sortBy: 'price_high', page: 1 }))}
                  className={`px-2 py-1 rounded transition cursor-pointer ${
                    filters.sortBy === 'price_high'
                      ? 'text-[#2874f0] font-bold border-b-2 border-[#2874f0]'
                      : 'hover:text-[#2874f0]'
                  }`}
                >
                  Price -- High to Low
                </button>

                <button
                  onClick={() => setFilters((p) => ({ ...p, sortBy: 'discount', page: 1 }))}
                  className={`px-2 py-1 rounded transition cursor-pointer hidden md:inline ${
                    filters.sortBy === 'discount'
                      ? 'text-[#2874f0] font-bold border-b-2 border-[#2874f0]'
                      : 'hover:text-[#2874f0]'
                  }`}
                >
                  Discount
                </button>

                {/* View toggle */}
                <div className="flex items-center border-l pl-3 gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded ${viewMode === 'grid' ? 'text-[#2874f0] bg-blue-50' : 'text-gray-400'}`}
                    title="Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('horizontal')}
                    className={`p-1 rounded ${viewMode === 'horizontal' ? 'text-[#2874f0] bg-blue-50' : 'text-gray-400'}`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid or List */}
            {loading ? (
              <div className="bg-white p-12 rounded border border-gray-200 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 size={32} className="animate-spin text-[#2874f0]" />
                <span className="text-xs text-gray-500 font-medium">
                  Loading Flipkart verified catalog...
                </span>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded border border-gray-200 text-center space-y-3">
                <PackageSearch size={44} className="text-gray-300 mx-auto" />
                <h4 className="font-bold text-gray-800 text-base">No Matching Products Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing some filters or search for another item like "Apple", "Sony", or "Samsung".
                </p>
                <button
                  onClick={() =>
                    setFilters({ category: 'all', search: '', sortBy: 'popularity', page: 1 })
                  }
                  className="bg-[#2874f0] text-white font-bold text-xs px-4 py-2 rounded shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} layout="horizontal" />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Modals & Notifications */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <SellerPortalModal />
      <AdminPortalModal />
      <AuthModal />
      <AddressManagerModal />
      <ShoppingAssistantModal />
      <ToastContainer />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainMarketplaceContent />
    </StoreProvider>
  );
}

/**
 * Flipkart Primary Header & Navigation Bar
 * High-performance search with live debounced suggestions, auth state, and admin access
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Package,
  Store,
  Sparkles,
  User as UserIcon,
  ChevronDown,
  Coins,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  LogOut,
  LogIn,
  Sliders,
  Tag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { apiClient } from '../../api/client';
import { SearchSuggestionItem } from '../../types';

export const Navbar: React.FC = () => {
  const {
    user,
    cart,
    wishlist,
    filters,
    setFilters,
    setActiveModal,
    setSelectedProduct,
    logout
  } = useStore();

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestionItem[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync internal searchInput when filters.search is changed externally (e.g., cleared)
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Debounced real search suggestions
  useEffect(() => {
    if (!searchInput || searchInput.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const results = await apiClient.getSearchSuggestions(searchInput.trim(), 8);
        setSuggestions(results);
      } catch (err) {
        console.error('Failed to load search suggestions', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    setShowSearchSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestionItem) => {
    setSearchInput(suggestion.text);
    if (suggestion.type === 'category' && suggestion.category) {
      setFilters((prev) => ({
        ...prev,
        category: suggestion.category!,
        search: '',
        page: 1
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        search: suggestion.text,
        page: 1
      }));
    }
    setShowSearchSuggestions(false);
  };

  return (
    <header id="flipkart-main-header" className="sticky top-0 z-40 bg-[#2874f0] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 md:gap-6">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2">
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-white hover:bg-blue-600 rounded transition cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <button
            id="btn-logo-home"
            onClick={() => {
              setFilters({ category: 'all', search: '', sortBy: 'popularity', page: 1 });
              setSelectedProduct(null);
            }}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-black italic tracking-wide text-white drop-shadow-sm">
              Flipkart
            </span>
            <div className="flex items-center gap-1 text-[11px] italic font-medium -mt-1 text-blue-100 group-hover:text-white">
              <span>Explore</span>
              <span className="text-[#ffe500] font-bold">Plus</span>
              <Sparkles size={11} className="text-[#ffe500] fill-[#ffe500]" />
            </div>
          </button>
        </div>

        {/* Center: Search Bar with Autocomplete */}
        <div ref={searchRef} className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              id="input-flipkart-search"
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              placeholder="Search for Products, Brands and More"
              className="w-full pl-4 pr-12 py-2 text-sm bg-white text-gray-800 placeholder-gray-500 rounded-xs shadow-inner focus:outline-none focus:ring-1 focus:ring-yellow-400"
            />
            <button
              id="btn-submit-search"
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3.5 text-[#2874f0] hover:text-blue-700 transition flex items-center justify-center cursor-pointer"
              title="Search"
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSearchSuggestions && searchInput.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-800 rounded-b shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="p-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                <span>Matching Suggestions</span>
                {loadingSuggestions && <span className="text-[10px] text-blue-500 animate-pulse">Searching...</span>}
              </div>

              {suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <button
                    key={`${item.text}-${idx}`}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full px-4 py-2.5 text-left text-xs sm:text-sm hover:bg-blue-50 flex items-center justify-between transition text-gray-700 hover:text-[#2874f0] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {item.type === 'category' ? (
                        <Tag size={14} className="text-emerald-500 shrink-0" />
                      ) : item.type === 'brand' ? (
                        <ShieldCheck size={14} className="text-purple-500 shrink-0" />
                      ) : (
                        <Search size={14} className="text-gray-400 shrink-0" />
                      )}
                      <span className="truncate">{item.text}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 px-1.5 py-0.5 rounded bg-gray-100 shrink-0">
                      {item.type}
                    </span>
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="w-full px-4 py-2.5 text-left text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Search size={13} className="text-[#2874f0]" />
                  <span>Search for "<strong>{searchInput}</strong>" in all categories</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-semibold">
          {/* AI Shopping Assistant Button */}
          <button
            id="btn-open-ai-genie"
            onClick={() => setActiveModal('aiAssistant')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-blue-900 px-3 py-1.5 rounded text-xs font-bold shadow-sm hover:brightness-105 transition cursor-pointer"
          >
            <Sparkles size={14} className="fill-blue-900" />
            <span>AI Genie</span>
          </button>

          {/* Become a Seller Button */}
          <button
            id="btn-open-seller-hub"
            onClick={() => setActiveModal('seller')}
            className="flex items-center gap-1.5 text-white hover:text-yellow-200 transition cursor-pointer"
          >
            <Store size={16} />
            <span className="whitespace-nowrap text-xs lg:text-sm">Seller Hub</span>
          </button>

          {/* Account Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            {user ? (
              <button
                id="btn-user-account"
                className="flex items-center gap-1.5 bg-white text-[#2874f0] px-3.5 py-1.5 rounded-xs font-bold text-xs lg:text-sm shadow-sm hover:bg-gray-50 transition cursor-pointer"
              >
                <UserIcon size={15} />
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown size={13} />
              </button>
            ) : (
              <button
                id="btn-login-trigger"
                onClick={() => setActiveModal('auth')}
                className="flex items-center gap-1.5 bg-white text-[#2874f0] px-5 py-1.5 rounded-xs font-extrabold text-xs lg:text-sm shadow-sm hover:bg-gray-100 transition cursor-pointer"
              >
                <LogIn size={15} />
                <span>Login</span>
              </button>
            )}

            {showAccountDropdown && user && (
              <div className="absolute right-0 top-full pt-2 w-64 z-50">
                <div className="bg-white text-gray-800 rounded shadow-2xl border border-gray-100 overflow-hidden text-sm">
                  {/* Plus membership ribbon */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2874f0] text-xs uppercase tracking-wide flex items-center gap-1">
                        <ShieldCheck size={14} /> {user.role === 'admin' ? 'Platform Admin' : 'Plus Member'}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[140px]">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold">
                      <Coins size={12} className="text-yellow-600 fill-yellow-500" />
                      <span>{user.superCoins}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    {/* Admin Console button if role is admin */}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveModal('admin');
                          setShowAccountDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 bg-purple-50 text-purple-900 font-bold hover:bg-purple-100 transition cursor-pointer border-b border-purple-100"
                      >
                        <ShieldCheck size={16} className="text-purple-600" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveModal('orders');
                        setShowAccountDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-blue-50 text-gray-700 hover:text-[#2874f0] transition cursor-pointer"
                    >
                      <Package size={16} className="text-gray-400" />
                      <span>Orders & Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveModal('addressManager');
                        setShowAccountDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-blue-50 text-gray-700 hover:text-[#2874f0] transition cursor-pointer"
                    >
                      <MapPin size={16} className="text-gray-400" />
                      <span>Saved Addresses</span>
                    </button>

                    <button
                      onClick={() => {
                        setFilters((p) => ({ ...p, category: 'all' }));
                        setShowAccountDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-blue-50 text-gray-700 hover:text-[#2874f0] transition cursor-pointer"
                    >
                      <Heart size={16} className="text-gray-400" />
                      <div className="flex items-center justify-between w-full">
                        <span>Wishlist</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                          {wishlist.length}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={async () => {
                        setShowAccountDropdown(false);
                        await logout();
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 text-red-600 transition cursor-pointer border-t border-gray-100 text-xs font-semibold"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon & Badge */}
          <button
            id="btn-open-cart"
            onClick={() => setActiveModal('cart')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition cursor-pointer relative"
            aria-label="View shopping cart"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {(cart?.itemCount || 0) > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-[#ffe500] text-blue-900 font-extrabold text-[11px] rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {cart?.itemCount}
                </span>
              )}
            </div>
            <span className="font-bold">Cart</span>
          </button>
        </div>

        {/* Mobile Cart Trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setActiveModal('aiAssistant')}
            className="p-1.5 bg-yellow-400 text-blue-900 rounded font-bold text-xs cursor-pointer"
            title="AI Genie"
          >
            <Sparkles size={16} />
          </button>
          <button
            onClick={() => setActiveModal('cart')}
            className="relative p-1 text-white cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {(cart?.itemCount || 0) > 0 && (
              <span className="absolute -top-1 -right-2 bg-yellow-300 text-blue-900 font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cart?.itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-600 px-4 py-3 space-y-2 text-sm">
          {user ? (
            <div className="flex items-center justify-between pb-2 border-b border-blue-600 text-xs">
              <span className="font-bold">{user.name} ({user.role})</span>
              <span className="bg-yellow-300 text-blue-950 font-bold px-2 py-0.5 rounded">
                🪙 {user.superCoins} Coins
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                setActiveModal('auth');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 bg-white text-[#2874f0] font-bold rounded flex items-center gap-2 mb-2"
            >
              <LogIn size={16} /> Sign In to Flipkart
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveModal('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 flex items-center gap-2 text-purple-200 font-bold"
            >
              <ShieldCheck size={16} /> Admin Console
            </button>
          )}

          <button
            onClick={() => {
              setActiveModal('orders');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 flex items-center gap-2"
          >
            <Package size={16} /> My Orders & Tracking
          </button>

          <button
            onClick={() => {
              setActiveModal('addressManager');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 flex items-center gap-2"
          >
            <MapPin size={16} /> Delivery Addresses
          </button>

          <button
            onClick={() => {
              setActiveModal('seller');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-1.5 flex items-center gap-2"
          >
            <Store size={16} /> Seller Hub
          </button>

          {user && (
            <button
              onClick={async () => {
                setMobileMenuOpen(false);
                await logout();
              }}
              className="w-full text-left py-1.5 flex items-center gap-2 text-red-200 border-t border-blue-600/50 pt-2"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

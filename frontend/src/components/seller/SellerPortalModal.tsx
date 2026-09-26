/**
 * Flipkart Seller Hub / MNC Vendor Center Modal
 */
import React, { useState, useEffect } from 'react';
import {
  X,
  Store,
  Plus,
  Package,
  TrendingUp,
  DollarSign,
  Star,
  CheckCircle2,
  Box
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { apiClient } from '../../api/client';
import { Product } from '../../types';

export const SellerPortalModal: React.FC = () => {
  const { activeModal, setActiveModal, showToast, categories } = useStore();

  const [dashboard, setDashboard] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'add_product' | 'inventory'>('overview');
  const [loading, setLoading] = useState(false);

  // Add Product Form
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stockQuantity, setStockQuantity] = useState('25');
  const [thumbnail, setThumbnail] = useState(
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
  );
  const [highlights, setHighlights] = useState('100% Genuine Quality, Fast Charging Support');

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getSellerDashboard('seller-retailnet');
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load seller dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModal === 'seller') {
      fetchSellerData();
    }
  }, [activeModal]);

  if (activeModal !== 'seller') return null;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !mrp) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      await apiClient.addSellerProduct({
        sellerId: 'seller-retailnet',
        title,
        brand: brand || 'Flipkart Basics',
        category,
        price: Number(price),
        mrp: Number(mrp),
        stockQuantity: Number(stockQuantity),
        thumbnail,
        highlights: highlights.split(',').map((s) => s.trim())
      });

      showToast('Product listed on Flipkart successfully with F-Assured badge!', 'success');
      setTitle('');
      setPrice('');
      setMrp('');
      setActiveTab('inventory');
      fetchSellerData();
    } catch (err: any) {
      showToast(err.message || 'Failed to list product', 'error');
    }
  };

  const stats = dashboard?.stats || {
    totalProducts: 4,
    totalStock: 154,
    totalOrders: 142050,
    totalRevenue: 289450000,
    averageRating: 4.8
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-seller-hub-modal"
        className="bg-white w-full max-w-5xl rounded-md shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#172337] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#2874f0] flex items-center justify-center">
              <Store size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Flipkart Seller Hub • RetailNet Pvt Ltd
                <span className="bg-emerald-500 text-white font-black text-[10px] px-1.5 py-0.2 rounded">
                  VERIFIED MNC SELLER
                </span>
              </h3>
              <p className="text-xs text-gray-400">GSTIN: 29ABCDE1234F1Z5 • Ekart Integrated</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-100 px-5 border-b border-gray-200 flex gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview & Analytics
          </button>
          <button
            onClick={() => setActiveTab('add_product')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'add_product'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus size={14} /> List New Product
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Catalog ({dashboard?.products?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span>Total Revenue</span>
                    <DollarSign size={16} className="text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-gray-900">
                    ₹{(stats.totalRevenue / 10000000).toFixed(2)} Cr
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">+18.4% this quarter</span>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span>Units Sold</span>
                    <TrendingUp size={16} className="text-[#2874f0]" />
                  </div>
                  <div className="text-xl font-black text-gray-900">
                    {stats.totalOrders.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-gray-500">Across 18,000+ PIN codes</span>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span>Active Catalog</span>
                    <Box size={16} className="text-purple-600" />
                  </div>
                  <div className="text-xl font-black text-gray-900">
                    {stats.totalProducts} Listings
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">100% In Stock</span>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span>Seller Rating</span>
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-xl font-black text-gray-900">
                    {stats.averageRating} ★
                  </div>
                  <span className="text-[11px] text-blue-600 font-bold">Flipkart Tier 1 Merchant</span>
                </div>
              </div>

              {/* Quick Action banner */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="font-black text-base">Boost your Festival Season Sales</h4>
                  <p className="text-xs text-blue-100 mt-1">
                    Add new products to the Big Billion Days sale pipeline with automatic Flipkart Assured badge.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add_product')}
                  className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-extrabold px-4 py-2 rounded text-xs transition whitespace-nowrap cursor-pointer"
                >
                  + Add Product Now
                </button>
              </div>
            </div>
          )}

          {activeTab === 'add_product' && (
            <div className="bg-white p-5 rounded border border-gray-200 shadow-xs max-w-2xl mx-auto">
              <h4 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b">
                List a New Product on Flipkart Marketplace
              </h4>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. boAt Rockerz 450 Bluetooth On-Ear Headphones with Mic"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. boAt, Sony, Samsung"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="1499"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Maximum MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="3990"
                      value={mrp}
                      onChange={(e) => setMrp(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Key Highlights (Comma-separated)</label>
                  <input
                    type="text"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-4 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold px-6 py-2 rounded shadow-xs transition"
                  >
                    Publish to Flipkart
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-3 bg-gray-50 font-bold text-gray-700 border-b flex justify-between items-center">
                <span>Active Listings in Warehouse</span>
                <span className="text-gray-500">{dashboard?.products?.length || 0} Products</span>
              </div>

              <div className="divide-y divide-gray-100">
                {(dashboard?.products || []).map((prod: Product) => (
                  <div key={prod.id} className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.thumbnail}
                        alt={prod.title}
                        className="w-12 h-12 object-contain rounded border p-0.5"
                      />
                      <div>
                        <h5 className="font-bold text-gray-900 line-clamp-1">{prod.title}</h5>
                        <div className="flex items-center gap-2 mt-0.5 text-gray-500">
                          <span>Brand: {prod.brand}</span>
                          <span>•</span>
                          <span>Category: {prod.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{prod.price.toLocaleString('en-IN')}</div>
                      <span className="inline-block bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded mt-0.5">
                        {prod.stockQuantity} in Stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

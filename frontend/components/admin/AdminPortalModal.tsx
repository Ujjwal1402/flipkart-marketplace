/**
 * Flipkart Enterprise Admin Panel
 * Protected Admin Console for Metrics, Inventory, Order Fulfillment & Products
 */
import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Users,
  Box,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Lock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { apiClient } from '../../api/client';
import { Product, Order, OrderStatus, User, AdminMetrics } from '../../types';

export const AdminPortalModal: React.FC = () => {
  const {
    user,
    activeModal,
    setActiveModal,
    showToast,
    adminUpdateOrderStatus,
    adminUpdateStock,
    adminDeleteProduct,
    categories
  } = useStore();

  const [activeTab, setActiveTab] = useState<'metrics' | 'orders' | 'inventory' | 'products' | 'users'>('metrics');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters in Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('mobiles');
  const [newPrice, setNewPrice] = useState('');
  const [newMrp, setNewMrp] = useState('');
  const [newStock, setNewStock] = useState('20');
  const [newThumbnail, setNewThumbnail] = useState(
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'
  );

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [m, o, pRes, u] = await Promise.all([
        apiClient.getAdminMetrics(),
        apiClient.getAdminOrders(),
        apiClient.getProducts({ limit: 100 }),
        apiClient.getAdminUsers()
      ]);
      setMetrics(m);
      setOrders(o);
      setProducts(pRes.products);
      setUsersList(u);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModal === 'admin') {
      fetchAdminData();
    }
  }, [activeModal]);

  if (activeModal !== 'admin') return null;

  // Protected route check
  if (!user || user.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-md max-w-md w-full p-6 text-center shadow-2xl space-y-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>
          <h3 className="text-lg font-black text-gray-900">Admin Privileges Required</h3>
          <p className="text-xs text-gray-600">
            This module is restricted to Flipkart platform administrators. You are currently logged in as{' '}
            <strong>{user ? `${user.name} (${user.role})` : 'Guest'}</strong>.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setActiveModal('auth')}
              className="flex-1 bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded shadow-xs cursor-pointer"
            >
              Sign In as Admin
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await adminUpdateOrderStatus(orderId, newStatus);
      fetchAdminData();
    } catch (err: any) {
      // Toast already shown
    }
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      await adminUpdateStock(productId, newStock);
      fetchAdminData();
    } catch (err: any) {
      // Toast already shown
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product from Flipkart?')) {
      try {
        await adminDeleteProduct(productId);
        fetchAdminData();
      } catch (err: any) {
        // Toast already shown
      }
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newMrp) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    try {
      await apiClient.createProduct({
        title: newTitle,
        brand: newBrand || 'Flipkart Basics',
        category: newCategory,
        price: Number(newPrice),
        mrp: Number(newMrp),
        stockQuantity: Number(newStock),
        thumbnail: newThumbnail,
        highlights: ['Enterprise Quality Assured', 'Ekart Fast Delivery']
      });

      showToast('Product added to live Flipkart catalog!', 'success');
      setShowAddProductModal(false);
      setNewTitle('');
      setNewPrice('');
      setNewMrp('');
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add product', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInventory = products.filter((p) => {
    return (
      p.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearch.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-admin-portal-modal"
        className="bg-white w-full max-w-6xl rounded-md shadow-2xl overflow-hidden my-4 max-h-[94vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#172337] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                Flipkart Enterprise Central Console
                <span className="bg-purple-700 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                  ADMIN ACTIVE
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">
                Logged in as {user.name} ({user.email}) • Full Operations Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              title="Refresh Data"
              className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800 transition cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-blue-400' : ''} />
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 px-5 border-b border-gray-200 flex gap-6 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'metrics'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp size={14} /> Overview & Metrics
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package size={14} /> Orders Management ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Box size={14} /> Inventory & Stock
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit size={14} /> Catalog Products ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#2874f0] text-[#2874f0]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={14} /> Users & Customers ({usersList.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {/* TAB 1: METRICS OVERVIEW */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span className="text-xs font-semibold uppercase">Total Revenue</span>
                    <DollarSign size={18} className="text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-gray-900">
                    ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Platform gross merchandise</p>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span className="text-xs font-semibold uppercase">Total Orders</span>
                    <Package size={18} className="text-[#2874f0]" />
                  </div>
                  <div className="text-xl font-black text-gray-900">{metrics?.totalOrders || 0}</div>
                  <p className="text-[11px] text-gray-500 font-semibold mt-1">Lifetime customer orders</p>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span className="text-xs font-semibold uppercase">Low Stock Alerts</span>
                    <AlertTriangle size={18} className="text-amber-500" />
                  </div>
                  <div className="text-xl font-black text-amber-600">{metrics?.lowStockCount || 0}</div>
                  <p className="text-[11px] text-amber-600 font-semibold mt-1">&lt; 10 units remaining</p>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between text-gray-500 mb-1">
                    <span className="text-xs font-semibold uppercase">Registered Users</span>
                    <Users size={18} className="text-purple-600" />
                  </div>
                  <div className="text-xl font-black text-gray-900">{metrics?.totalUsers || 0}</div>
                  <p className="text-[11px] text-gray-500 font-semibold mt-1">Active customer base</p>
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="bg-white p-5 rounded border border-gray-200 shadow-xs">
                <h4 className="font-bold text-gray-800 text-sm mb-3">Order Status Pipeline</h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {['PLACED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <div key={st} className="p-3 bg-gray-50 rounded border border-gray-200 text-center">
                      <p className="text-[10px] font-bold text-gray-500">{st}</p>
                      <p className="text-lg font-black text-gray-900 mt-0.5">
                        {metrics?.ordersByStatus[st] || 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded border border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search order #, customer name, email..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#2874f0] outline-none"
                    />
                    <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 font-bold">Filter Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-1.5 border border-gray-300 rounded text-xs bg-white outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PLACED">Placed</option>
                    <option value="PACKED">Packed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3">Update Transition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-500">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-blue-50/40 transition">
                          <td className="p-3 font-bold text-gray-900">
                            {ord.orderNumber}
                            <p className="text-[10px] text-gray-400 font-normal">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="p-3">
                            <p className="font-semibold text-gray-800">{ord.customerName}</p>
                            <p className="text-[10px] text-gray-500">{ord.customerEmail}</p>
                          </td>
                          <td className="p-3 text-gray-600">
                            {ord.items.length} item(s)
                            <p className="text-[10px] text-gray-500 truncate max-w-xs">
                              {ord.items[0]?.title}
                            </p>
                          </td>
                          <td className="p-3 font-bold text-gray-900">
                            ₹{ord.pricing.finalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              {ord.payment.method}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.status === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'CANCELLED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                              className="p-1 border border-gray-300 rounded text-[11px] bg-white outline-none focus:border-[#2874f0]"
                            >
                              <option value="PLACED">Placed</option>
                              <option value="PACKED">Packed</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded border border-gray-200 flex items-center justify-between">
                <div className="relative w-80">
                  <input
                    type="text"
                    placeholder="Search product title or brand..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded outline-none"
                  />
                  <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  Showing {filteredInventory.length} products in stock tracking
                </span>
              </div>

              <div className="bg-white rounded border border-gray-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Selling Price</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Stock Status</th>
                      <th className="p-3">Quick Stock Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInventory.map((p) => {
                      const isLow = p.stockQuantity < 10;
                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="p-3 flex items-center gap-2.5">
                            <img
                              src={p.thumbnail}
                              alt={p.title}
                              className="w-9 h-9 object-contain rounded border border-gray-100 p-0.5"
                            />
                            <div>
                              <p className="font-semibold text-gray-800 line-clamp-1 max-w-xs">{p.title}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{p.brand}</p>
                            </div>
                          </td>
                          <td className="p-3 capitalize text-gray-600">{p.category}</td>
                          <td className="p-3 font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</td>
                          <td className="p-3 font-bold text-gray-800">{p.stockQuantity} units</td>
                          <td className="p-3">
                            {isLow ? (
                              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-max">
                                <AlertTriangle size={11} /> Low Stock (&lt;10)
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                Healthy Stock
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStockUpdate(p.id, Math.max(0, p.stockQuantity - 5))}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold transition cursor-pointer"
                                title="Reduce stock by 5"
                              >
                                -5
                              </button>
                              <button
                                onClick={() => handleStockUpdate(p.id, p.stockQuantity + 10)}
                                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#2874f0] rounded text-xs font-bold transition cursor-pointer"
                                title="Add 10 units"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CATALOG PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Product Catalog ({products.length})</h4>
                  <p className="text-[11px] text-gray-500">Manage all live listings, pricing, and tags</p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={15} /> Add New Product
                </button>
              </div>

              <div className="bg-white rounded border border-gray-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Price / MRP</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">F-Assured</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-3 flex items-center gap-2.5">
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-10 h-10 object-contain rounded border border-gray-100 p-0.5"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1 max-w-sm">{p.title}</p>
                            <p className="text-[10px] text-gray-400">
                              {p.brand} • {p.category}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-gray-400 line-through ml-1.5">
                            ₹{p.mrp.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-emerald-700">{p.discountPercent}% off</td>
                        <td className="p-3">
                          {p.isFAssured ? (
                            <span className="bg-blue-100 text-[#2874f0] font-black text-[10px] px-1.5 py-0.5 rounded">
                              ✓ F-Assured
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-gray-700">{p.stockQuantity}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: REGISTERED USERS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded border border-gray-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">SuperCoins</th>
                    <th className="p-3">Plus Member</th>
                    <th className="p-3">Addresses Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{u.name}</td>
                      <td className="p-3 text-gray-600">
                        <p>{u.email}</p>
                        <p className="text-[10px] text-gray-400">{u.phone}</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-600">{u.superCoins}</td>
                      <td className="p-3">
                        {u.isPlusMember ? (
                          <span className="text-emerald-600 font-bold text-[11px]">✓ Plus</span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Regular</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600">{u.addresses?.length || 0} address(es)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal inside Admin: Create Product */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-md max-w-lg w-full p-5 shadow-2xl space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-bold text-sm text-gray-900">Add New Catalog Product</h4>
                <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-gray-800">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Google Pixel 8 Pro (128 GB, Obsidian)"
                    className="w-full p-2 border rounded outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="e.g. Google"
                      className="w-full p-2 border rounded outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2 border rounded outline-none bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="69999"
                      className="w-full p-2 border rounded outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newMrp}
                      onChange={(e) => setNewMrp(e.target.value)}
                      placeholder="84999"
                      className="w-full p-2 border rounded outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Initial Stock</label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full p-2 border rounded outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Image Thumbnail URL</label>
                  <input
                    type="url"
                    value={newThumbnail}
                    onChange={(e) => setNewThumbnail(e.target.value)}
                    className="w-full p-2 border rounded outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#2874f0] text-white font-bold py-2 rounded text-xs uppercase"
                  >
                    Save & Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="border border-gray-300 px-4 py-2 rounded text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

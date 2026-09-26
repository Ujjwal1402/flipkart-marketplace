/**
 * Flipkart Order History & Live Ekart Delivery Tracking Modal
 */
import React, { useState } from 'react';
import {
  X,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, TrackingStep } from '../../types';

export const OrderTrackingModal: React.FC = () => {
  const {
    orders,
    activeModal,
    setActiveModal,
    cancelOrder,
    selectedOrder,
    setSelectedOrder,
    showToast
  } = useStore();

  const [activeTabOrder, setActiveTabOrder] = useState<Order | null>(
    selectedOrder || orders[0] || null
  );

  if (activeModal !== 'orders') return null;

  const currentOrder = selectedOrder || activeTabOrder || orders[0];

  const handleDownloadInvoice = (order: Order) => {
    showToast(`Downloading Tax Invoice for ${order.orderNumber}...`, 'info');
  };

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder(orderId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-orders-modal"
        className="bg-white w-full max-w-5xl rounded-md shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={20} />
            <h3 className="font-bold text-base">My Orders & Live Shipment Tracking</h3>
          </div>
          <button
            onClick={() => {
              setActiveModal(null);
              setSelectedOrder(null);
            }}
            className="text-white hover:bg-blue-600 p-1 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded text-center max-w-md mx-auto my-8 border">
              <Package size={48} className="text-gray-300 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 text-base">No Orders Found</h4>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                You have not placed any orders yet. Start exploring great deals!
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#2874f0] text-white font-bold text-xs px-4 py-2 rounded"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: Orders List (5 cols) */}
              <div className="md:col-span-5 space-y-3">
                <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
                  Past & Active Orders ({orders.length})
                </h4>

                <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
                  {orders.map((ord) => {
                    const isSelected = currentOrder?.id === ord.id;
                    const firstItem = ord.items[0];
                    return (
                      <div
                        key={ord.id}
                        onClick={() => {
                          setActiveTabOrder(ord);
                          setSelectedOrder(ord);
                        }}
                        className={`p-3 bg-white rounded border cursor-pointer transition ${
                          isSelected
                            ? 'border-[#2874f0] ring-1 ring-[#2874f0] shadow-xs'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-bold text-gray-900">{ord.orderNumber}</span>
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>

                        {firstItem && (
                          <div className="flex items-center gap-2.5">
                            <img
                              src={firstItem.thumbnail}
                              alt={firstItem.title}
                              className="w-12 h-12 object-contain rounded border border-gray-100 p-0.5"
                            />
                            <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-semibold text-gray-800 truncate">
                                {firstItem.title}
                              </p>
                              <p className="text-xs font-bold text-gray-900 mt-0.5">
                                ₹{ord.pricing.finalAmount.toLocaleString('en-IN')}{' '}
                                {ord.items.length > 1 && (
                                  <span className="text-[11px] font-normal text-gray-500">
                                    (+{ord.items.length - 1} more items)
                                  </span>
                                )}
                              </p>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Tracking Stepper (7 cols) */}
              {currentOrder && (
                <div className="md:col-span-7 bg-white p-5 rounded border border-gray-200 shadow-xs space-y-6">
                  {/* Order Top Summary */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-200 text-xs">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        Order #{currentOrder.orderNumber}
                      </p>
                      <p className="text-gray-500 mt-0.5">
                        Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownloadInvoice(currentOrder)}
                      className="border border-[#2874f0] text-[#2874f0] hover:bg-blue-50 px-3 py-1.5 rounded font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download size={13} /> Invoice
                    </button>
                  </div>

                  {/* Shipment Tracking Stepper */}
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Truck size={15} className="text-[#2874f0]" /> Ekart Logistics Live Status
                    </h5>

                    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                      {currentOrder.trackingHistory.map((step: TrackingStep, idx: number) => (
                        <div key={idx} className="relative text-xs">
                          {/* Circle marker */}
                          <div
                            className={`absolute -left-6 top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              step.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : step.current
                                ? 'bg-blue-600 border-blue-600 ring-2 ring-blue-100 text-white'
                                : 'bg-white border-gray-300'
                            }`}
                          >
                            {step.completed && <CheckCircle2 size={10} />}
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold ${
                                  step.completed || step.current
                                    ? 'text-gray-900'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step.title}
                              </span>
                              <span className="text-gray-400 text-[11px]">{step.timestamp}</span>
                            </div>
                            <p className="text-gray-500 text-[11px] mt-0.5">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address & Actions */}
                  <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-gray-700 block mb-1">Delivery Address:</span>
                      <p className="text-gray-600 leading-relaxed">
                        <strong>{currentOrder.deliveryAddress.name}</strong> ({currentOrder.deliveryAddress.phone})<br />
                        {currentOrder.deliveryAddress.addressLine}, {currentOrder.deliveryAddress.locality}<br />
                        {currentOrder.deliveryAddress.city}, {currentOrder.deliveryAddress.state} - {currentOrder.deliveryAddress.pincode}
                      </p>
                    </div>

                    <div className="sm:text-right flex flex-col justify-between">
                      <div>
                        <span className="text-gray-500">Payment:</span>{' '}
                        <strong className="text-gray-900">{currentOrder.payment.method}</strong>
                        <p className="text-gray-500">Status: {currentOrder.payment.status}</p>
                      </div>

                      {currentOrder.status !== 'CANCELLED' && currentOrder.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleCancelOrder(currentOrder.id)}
                          className="mt-3 text-red-600 hover:text-red-700 font-bold text-xs hover:underline flex items-center justify-end gap-1 cursor-pointer"
                        >
                          <AlertTriangle size={13} /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

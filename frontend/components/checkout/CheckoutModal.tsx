/**
 * Flipkart 4-Step Accordion Checkout Modal
 * Step 1: Login Verification
 * Step 2: Delivery Address Selection & CRUD
 * Step 3: Order Summary Review
 * Step 4: Multi-Method Payment with Validation & Simulation
 */
import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  MapPin,
  CreditCard,
  QrCode,
  ShieldCheck,
  Plus,
  ArrowRight,
  PackageCheck,
  Building,
  Home,
  AlertCircle,
  Truck,
  Sparkles,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserAddress, Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    user,
    cart,
    activeModal,
    setActiveModal,
    placeOrder,
    addNewAddress,
    setSelectedOrder,
    login,
    showToast
  } = useStore();

  const [activeStep, setActiveStep] = useState<number>(user ? 2 : 1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses?.find((a) => a.isDefault)?.id || user?.addresses[0]?.id || ''
  );

  // Auth in Step 1
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Inline New Address Form
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [newAddressForm, setNewAddressForm] = useState<Omit<UserAddress, 'id'>>({
    name: user?.name || '',
    phone: user?.phone?.replace(/\D/g, '') || '',
    pincode: '',
    locality: '',
    addressLine: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    landmark: '',
    addressType: 'HOME',
    isDefault: true
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'EMI'>('UPI');
  const [upiId, setUpiId] = useState('ujjwal@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [captchaCode, setCaptchaCode] = useState('784');
  const [captchaInput, setCaptchaInput] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'checkout') return null;

  // Handle Step 1 Login
  const handleStep1Login = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter email/phone and password');
      return;
    }
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      if (loggedUser.addresses.length > 0) {
        setSelectedAddressId(loggedUser.addresses[0].id);
      }
      setActiveStep(2);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleQuickStep1Login = async (role: 'customer' | 'admin') => {
    try {
      if (role === 'customer') {
        const u = await login('ujjwal14022003@gmail.com', 'Customer@123');
        if (u.addresses.length > 0) setSelectedAddressId(u.addresses[0].id);
      } else {
        const u = await login('admin@flipkart.com', 'Admin@123');
        if (u.addresses.length > 0) setSelectedAddressId(u.addresses[0].id);
      }
      setActiveStep(2);
    } catch (err: any) {
      setAuthError(err.message || 'Quick login failed');
    }
  };

  // Handle New Address Form in Step 2
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError('');
    if (!newAddressForm.name.trim()) {
      setAddressError('Receiver name is required');
      return;
    }
    const cleanPhone = newAddressForm.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setAddressError('Please enter a valid 10-digit mobile number');
      return;
    }
    const cleanPin = newAddressForm.pincode.replace(/\D/g, '');
    if (cleanPin.length < 6) {
      setAddressError('Please enter a valid 6-digit PIN code');
      return;
    }
    if (!newAddressForm.addressLine.trim() || !newAddressForm.locality.trim()) {
      setAddressError('Address line and locality are required');
      return;
    }

    try {
      await addNewAddress(newAddressForm);
      setIsAddingNewAddress(false);
      setAddressError('');
      if (user?.addresses && user.addresses.length > 0) {
        setSelectedAddressId(user.addresses[user.addresses.length - 1].id);
      }
    } catch (err: any) {
      setAddressError(err.message || 'Failed to save address');
    }
  };

  // Handle Complete Order (Step 4)
  const handleCompleteOrder = async () => {
    setPaymentError('');

    // Validation
    const effectiveAddressId = selectedAddressId || user?.addresses[0]?.id;
    if (!effectiveAddressId) {
      setPaymentError('Please select or add a delivery address first.');
      setActiveStep(2);
      return;
    }

    if (paymentMethod === 'UPI') {
      if (!upiId.includes('@') || upiId.length < 5) {
        setPaymentError('Please enter a valid UPI ID (e.g. yourname@okhdfcbank)');
        return;
      }
    } else if (paymentMethod === 'CARD') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (cleanCard.length < 16) {
        setPaymentError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setPaymentError('Please enter expiry in MM/YY format (e.g. 08/29).');
        return;
      }
      if (cardCvv.length < 3) {
        setPaymentError('Please enter a valid 3-digit CVV.');
        return;
      }
    } else if (paymentMethod === 'COD') {
      if (captchaInput.trim() !== captchaCode) {
        setPaymentError('Invalid Captcha code. Please re-enter the 3-digit code.');
        return;
      }
    }

    if (simulateFailure) {
      setPaymentError('Payment failed: Bank servers timed out. (Simulated test error)');
      showToast('Payment transaction failed. Please retry.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await placeOrder(effectiveAddressId, paymentMethod);
      setPlacedOrder(order);
    } catch (err: any) {
      setPaymentError(err.message || 'Order placement failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order completed successfully, show confirmation screen
  if (placedOrder) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-md max-w-lg w-full p-6 text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <PackageCheck size={36} />
          </div>

          <h2 className="text-xl font-black text-gray-900">Order Placed Successfully!</h2>
          <p className="text-xs text-gray-600">
            Thank you for shopping on Flipkart! Your order confirmation has been dispatched to{' '}
            <strong>{placedOrder.customerEmail}</strong>.
          </p>

          <div className="bg-gray-50 rounded p-3 text-xs text-left border border-gray-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <strong className="text-gray-900">{placedOrder.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid:</span>
              <strong className="text-gray-900">
                ₹{placedOrder.pricing.finalAmount.toLocaleString('en-IN')} ({placedOrder.payment.method})
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipment Partner:</span>
              <span className="font-semibold text-blue-700 flex items-center gap-1">
                <Truck size={13} /> {placedOrder.courierName || 'Ekart Logistics Express'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ekart Tracking AWB:</span>
              <span className="font-mono font-bold text-gray-800">{placedOrder.trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Delivery:</span>
              <strong className="text-emerald-700">{placedOrder.estimatedDelivery}</strong>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedOrder(placedOrder);
                setActiveModal('orders');
              }}
              className="flex-1 bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded shadow-xs cursor-pointer"
            >
              Track Shipment in Ekart
            </button>
            <button
              onClick={() => {
                setPlacedOrder(null);
                setActiveModal(null);
              }}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 rounded cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedAddr = user?.addresses?.find((a) => a.id === selectedAddressId) || user?.addresses?.[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-checkout-modal"
        className="bg-gray-100 w-full max-w-4xl rounded-md shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-yellow-300" />
            <h3 className="font-bold text-sm sm:text-base">Flipkart 100% Safe & Secure Checkout</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-white hover:bg-blue-600 p-1 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Accordion Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {/* STEP 1: LOGIN */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-3.5 flex items-center justify-between bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-[#2874f0] text-white font-bold text-xs rounded-full flex items-center justify-center">
                  1
                </span>
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  LOGIN IDENTIFICATION
                </span>
                {user && <CheckCircle2 size={16} className="text-emerald-600" />}
              </div>
              {user && activeStep !== 1 && (
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs text-[#2874f0] font-bold uppercase hover:underline cursor-pointer"
                >
                  Change
                </button>
              )}
            </div>

            {activeStep === 1 && (
              <div className="p-4 space-y-3">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.phone} • {user.email}</p>
                    </div>
                    <button
                      onClick={() => setActiveStep(2)}
                      className="bg-[#fb641b] text-white font-extrabold px-6 py-2 rounded-xs text-xs uppercase cursor-pointer"
                    >
                      CONTINUE CHECKOUT
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-md">
                    <p className="text-xs text-gray-600">
                      Sign in to your Flipkart account to proceed with checkout.
                    </p>

                    {authError && (
                      <div className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                        {authError}
                      </div>
                    )}

                    <form onSubmit={handleStep1Login} className="space-y-2.5">
                      <input
                        type="text"
                        placeholder="Email or Mobile"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full p-2 border rounded text-xs outline-none"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full p-2 border rounded text-xs outline-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-[#fb641b] text-white font-bold py-2 rounded text-xs uppercase cursor-pointer"
                      >
                        Sign In
                      </button>
                    </form>

                    <div className="pt-2 border-t flex gap-2">
                      <button
                        onClick={() => handleQuickStep1Login('customer')}
                        type="button"
                        className="flex-1 p-2 bg-blue-50 text-[#2874f0] font-bold text-[11px] rounded border border-blue-200 cursor-pointer"
                      >
                        ⚡ Use Customer Demo
                      </button>
                      <button
                        onClick={() => handleQuickStep1Login('admin')}
                        type="button"
                        className="flex-1 p-2 bg-purple-50 text-purple-700 font-bold text-[11px] rounded border border-purple-200 cursor-pointer"
                      >
                        ⚡ Use Admin Demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: DELIVERY ADDRESS */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-3.5 flex items-center justify-between bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-[#2874f0] text-white font-bold text-xs rounded-full flex items-center justify-center">
                  2
                </span>
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  DELIVERY ADDRESS
                </span>
                {selectedAddr && activeStep > 2 && <CheckCircle2 size={16} className="text-emerald-600" />}
              </div>
              {activeStep > 2 && (
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs text-[#2874f0] font-bold uppercase hover:underline cursor-pointer"
                >
                  Change
                </button>
              )}
            </div>

            {activeStep === 2 && (
              <div className="p-4 space-y-3">
                {/* Saved addresses list */}
                {user?.addresses && user.addresses.length > 0 && !isAddingNewAddress && (
                  <div className="space-y-2.5">
                    {user.addresses.map((addr) => {
                      const isSelected = (selectedAddressId || user.addresses[0].id) === addr.id;
                      return (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition ${
                            isSelected
                              ? 'border-[#2874f0] bg-blue-50/40 ring-1 ring-[#2874f0]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 text-[#2874f0]"
                          />
                          <div className="text-xs flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{addr.name}</span>
                              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded text-[10px] font-bold uppercase">
                                {addr.addressType}
                              </span>
                              <span className="font-semibold text-gray-700">{addr.phone}</span>
                            </div>
                            <p className="text-gray-600 mt-1">
                              {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} -{' '}
                              <strong>{addr.pincode}</strong>
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Add New Address Button */}
                {!isAddingNewAddress && (
                  <button
                    onClick={() => {
                      setIsAddingNewAddress(true);
                      setAddressError('');
                    }}
                    className="w-full py-2.5 border border-dashed border-[#2874f0] text-[#2874f0] hover:bg-blue-50/40 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus size={15} /> Add a New Delivery Address
                  </button>
                )}

                {/* Inline New Address Form */}
                {isAddingNewAddress && (
                  <form onSubmit={handleSaveAddress} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2.5 text-xs">
                    <h5 className="font-bold text-gray-800 uppercase tracking-wider">New Address Details</h5>

                    {addressError && (
                      <div className="p-2 bg-red-50 text-red-700 rounded border border-red-200">
                        {addressError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Receiver Name *"
                        required
                        value={newAddressForm.name}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                        className="p-2 border rounded bg-white outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="10-digit Phone *"
                        required
                        value={newAddressForm.phone}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                        className="p-2 border rounded bg-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="6-digit Pincode *"
                        required
                        maxLength={6}
                        value={newAddressForm.pincode}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, pincode: e.target.value })}
                        className="p-2 border rounded bg-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Locality *"
                        required
                        value={newAddressForm.locality}
                        onChange={(e) => setNewAddressForm({ ...newAddressForm, locality: e.target.value })}
                        className="p-2 border rounded bg-white outline-none"
                      />
                    </div>

                    <textarea
                      placeholder="Address (Area and Street) *"
                      required
                      value={newAddressForm.addressLine}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, addressLine: e.target.value })}
                      className="w-full p-2 border rounded bg-white outline-none"
                      rows={2}
                    />

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-[#fb641b] text-white font-bold px-4 py-2 rounded text-xs cursor-pointer uppercase"
                      >
                        Save & Deliver Here
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="border border-gray-300 px-4 py-2 rounded text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {!isAddingNewAddress && (
                  <button
                    onClick={() => setActiveStep(3)}
                    disabled={!user?.addresses || user.addresses.length === 0}
                    className="bg-[#fb641b] text-white font-extrabold px-6 py-2.5 rounded-xs text-xs uppercase tracking-wider shadow hover:bg-[#e8560f] transition cursor-pointer disabled:opacity-50"
                  >
                    DELIVER HERE
                  </button>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: ORDER SUMMARY */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-3.5 flex items-center justify-between bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-[#2874f0] text-white font-bold text-xs rounded-full flex items-center justify-center">
                  3
                </span>
                <span className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                  ORDER SUMMARY ({cart?.itemCount} Items)
                </span>
                {activeStep > 3 && <CheckCircle2 size={16} className="text-emerald-600" />}
              </div>
              {activeStep > 3 && (
                <button
                  onClick={() => setActiveStep(3)}
                  className="text-xs text-[#2874f0] font-bold uppercase hover:underline cursor-pointer"
                >
                  Change
                </button>
              )}
            </div>

            {activeStep === 3 && (
              <div className="p-4 space-y-3">
                <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
                  {cart?.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center gap-3 text-xs">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="w-14 h-14 object-contain rounded border border-gray-100 p-1"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 line-clamp-1">{item.product.title}</p>
                        <p className="text-gray-500">Qty: {item.quantity} • Seller: {item.product.sellerName}</p>
                        <p className="font-bold text-gray-900">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="text-emerald-700 font-medium text-[11px]">
                        ✓ Delivery Tomorrow
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Order confirmation email will be sent to <strong>{user?.email}</strong>
                  </span>
                  <button
                    onClick={() => setActiveStep(4)}
                    className="bg-[#fb641b] text-white font-extrabold px-6 py-2.5 rounded-xs text-xs uppercase tracking-wider shadow hover:bg-[#e8560f] transition cursor-pointer"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: PAYMENT OPTIONS */}
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-3.5 flex items-center gap-3 bg-gray-50 border-b border-gray-100">
              <span className="w-5 h-5 bg-[#2874f0] text-white font-bold text-xs rounded-full flex items-center justify-center">
                4
              </span>
              <span className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                PAYMENT OPTIONS
              </span>
            </div>

            {activeStep === 4 && (
              <div className="p-4 space-y-4">
                {paymentError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Method Radios */}
                <div className="space-y-3">
                  {/* UPI */}
                  <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-1 text-[#2874f0]"
                    />
                    <div className="text-xs flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <QrCode size={16} className="text-[#2874f0]" />
                        <span>UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                      </div>
                      {paymentMethod === 'UPI' && (
                        <div className="mt-2.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                              className="p-2 border rounded text-xs w-64 bg-white outline-none focus:border-[#2874f0]"
                            />
                            <span className="text-emerald-600 font-bold text-xs">✓ Verified VPA</span>
                          </div>
                          <div className="flex gap-2">
                            {['ujjwal@okhdfcbank', 'paytm-98765@paytm', 'phonepe@ybl'].map((sample) => (
                              <button
                                key={sample}
                                type="button"
                                onClick={() => setUpiId(sample)}
                                className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700"
                              >
                                {sample}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="mt-1 text-[#2874f0]"
                    />
                    <div className="text-xs flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <CreditCard size={16} className="text-[#2874f0]" />
                        <span>Credit / Debit / ATM Card</span>
                      </div>

                      {paymentMethod === 'CARD' && (
                        <div className="mt-2.5 space-y-2 max-w-sm">
                          <input
                            type="text"
                            placeholder="Card Number (16 digits)"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 border rounded text-xs outline-none bg-white"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Valid Thru (MM/YY)"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="p-2 border rounded text-xs outline-none bg-white"
                            />
                            <input
                              type="password"
                              placeholder="CVV (3 digits)"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="p-2 border rounded text-xs outline-none bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCardNumber('4532 8912 3456 7890');
                              setCardExpiry('12/28');
                              setCardCvv('892');
                            }}
                            className="text-[10px] text-[#2874f0] underline font-semibold"
                          >
                            Fill Test Card Credentials
                          </button>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={() => setPaymentMethod('NETBANKING')}
                      className="mt-1 text-[#2874f0]"
                    />
                    <div className="text-xs flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <Building size={16} className="text-[#2874f0]" />
                        <span>Net Banking</span>
                      </div>
                      {paymentMethod === 'NETBANKING' && (
                        <div className="mt-2.5">
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="p-2 border rounded text-xs bg-white outline-none"
                          >
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="State Bank of India">State Bank of India</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Cash On Delivery */}
                  <label className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 text-[#2874f0]"
                    />
                    <div className="text-xs flex-1">
                      <span className="font-bold text-gray-900">Cash on Delivery (COD)</span>
                      {paymentMethod === 'COD' && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="p-2 bg-gray-200 font-mono font-bold tracking-widest text-sm rounded">
                            {captchaCode}
                          </span>
                          <input
                            type="text"
                            placeholder="Enter 3-digit Captcha"
                            maxLength={3}
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            className="p-2 border rounded text-xs w-44 bg-white outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Audit Testing: Simulate Failure option for Feature 5 & Feature 9 */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateFailure}
                      onChange={(e) => setSimulateFailure(e.target.checked)}
                      className="rounded text-red-600"
                    />
                    <span>Simulate Payment Gateway Failure (to test error resilience)</span>
                  </label>
                </div>

                {/* Final Checkout Bar */}
                <div className="pt-4 border-t flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500">Total Payable:</span>
                    <div className="text-lg font-black text-gray-900">
                      ₹{cart?.finalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    id="btn-confirm-and-pay"
                    disabled={isSubmitting}
                    onClick={handleCompleteOrder}
                    className="bg-[#fb641b] hover:bg-[#e8560f] text-white font-extrabold px-8 py-3 rounded-xs uppercase tracking-wide text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'PROCESSING...' : `PAY ₹${cart?.finalAmount.toLocaleString('en-IN')}`}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

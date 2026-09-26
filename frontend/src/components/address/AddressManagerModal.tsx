/**
 * Flipkart Address Book Manager Modal
 * Full CRUD: Add, Edit, Delete, Set Default Address with Validation
 */
import React, { useState } from 'react';
import { X, MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Building, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserAddress } from '../../types';

export const AddressManagerModal: React.FC = () => {
  const {
    user,
    activeModal,
    setActiveModal,
    addNewAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    showToast
  } = useStore();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<Omit<UserAddress, 'id'>>({
    name: user?.name || '',
    phone: user?.phone?.replace(/\D/g, '') || '',
    pincode: '',
    locality: '',
    addressLine: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    landmark: '',
    addressType: 'HOME',
    isDefault: false
  });

  if (activeModal !== 'addressManager') return null;

  const handleStartAdd = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone?.replace(/\D/g, '') || '',
      pincode: '',
      locality: '',
      addressLine: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: '',
      addressType: 'HOME',
      isDefault: !user?.addresses || user.addresses.length === 0
    });
    setErrorMsg('');
    setIsEditing(null);
    setIsAdding(true);
  };

  const handleStartEdit = (addr: UserAddress) => {
    setFormData({
      name: addr.name,
      phone: addr.phone,
      pincode: addr.pincode,
      locality: addr.locality,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      landmark: addr.landmark || '',
      addressType: addr.addressType,
      isDefault: addr.isDefault
    });
    setErrorMsg('');
    setIsAdding(false);
    setIsEditing(addr.id);
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Name is required';
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return 'Please enter a valid 10-digit mobile number';
    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (cleanPin.length < 6) return 'Please enter a valid 6-digit PIN code';
    if (!formData.locality.trim()) return 'Locality is required';
    if (!formData.addressLine.trim()) return 'Street address is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    try {
      if (isEditing) {
        await updateAddress(isEditing, formData);
        setIsEditing(null);
      } else {
        await addNewAddress(formData);
        setIsAdding(false);
      }
      setErrorMsg('');
    } catch (apiErr: any) {
      setErrorMsg(apiErr.message || 'Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
      } catch (err: any) {
        // Handled
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (err: any) {
      // Handled
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-address-manager-modal"
        className="bg-white w-full max-w-2xl rounded-md shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <h3 className="font-bold text-base">Manage Delivery Addresses</h3>
          </div>
          <button
            onClick={() => {
              setActiveModal(null);
              setIsAdding(false);
              setIsEditing(null);
            }}
            className="text-white hover:bg-blue-600 p-1 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50 space-y-4">
          {/* Add Address Button Header */}
          {!isAdding && !isEditing && (
            <button
              onClick={handleStartAdd}
              className="w-full bg-white p-3.5 rounded border border-dashed border-[#2874f0] text-[#2874f0] hover:bg-blue-50/50 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-xs"
            >
              <Plus size={16} /> Add a New Address
            </button>
          )}

          {/* Form when adding or editing */}
          {(isAdding || isEditing) && (
            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider border-b pb-2">
                {isEditing ? 'Edit Address' : 'Add New Address'}
              </h4>

              {errorMsg && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Receiver's name"
                      className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">10-Digit Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">6-Digit PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="560103"
                      className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Locality / Sector *</label>
                    <input
                      type="text"
                      required
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      placeholder="Bellandur Outer Ring Rd"
                      className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Address (Area and Street) *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    placeholder="Flat / Room number, building name, street"
                    className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="Near Central Mall"
                      className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[#2874f0]"
                    />
                  </div>
                </div>

                {/* Address Type */}
                <div className="pt-1">
                  <label className="block text-gray-700 font-semibold mb-1">Address Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="addrType"
                        checked={formData.addressType === 'HOME'}
                        onChange={() => setFormData({ ...formData, addressType: 'HOME' })}
                        className="text-[#2874f0]"
                      />
                      <span>Home (All day delivery)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                      <input
                        type="radio"
                        name="addrType"
                        checked={formData.addressType === 'WORK'}
                        onChange={() => setFormData({ ...formData, addressType: 'WORK' })}
                        className="text-[#2874f0]"
                      />
                      <span>Work (Delivery 10 AM - 5 PM)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <button
                    type="submit"
                    className="bg-[#fb641b] hover:bg-[#e8560f] text-white font-extrabold px-6 py-2 rounded-xs uppercase tracking-wide cursor-pointer shadow-xs"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setIsEditing(null);
                    }}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          <div className="space-y-3">
            {(!user?.addresses || user.addresses.length === 0) && !isAdding && !isEditing ? (
              <div className="bg-white p-8 rounded border border-gray-200 text-center space-y-2">
                <MapPin size={40} className="text-gray-300 mx-auto" />
                <h4 className="font-bold text-gray-800 text-sm">No Addresses Saved Yet</h4>
                <p className="text-xs text-gray-500">
                  Add a delivery address to complete orders smoothly on Flipkart.
                </p>
                <button
                  onClick={handleStartAdd}
                  className="bg-[#2874f0] text-white font-bold text-xs px-4 py-2 rounded mt-2"
                >
                  Add New Address
                </button>
              </div>
            ) : (
              user?.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white p-4 rounded border transition ${
                    addr.isDefault
                      ? 'border-[#2874f0] ring-1 ring-[#2874f0] shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{addr.name}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                        {addr.addressType === 'HOME' ? <Home size={11} /> : <Building size={11} />}
                        {addr.addressType}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => handleStartEdit(addr)}
                        className="text-[#2874f0] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="text-red-500 hover:text-red-700 p-1 transition cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                    {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} -{' '}
                    <strong className="text-gray-800">{addr.pincode}</strong>
                    {addr.landmark && <span className="text-gray-500"> (Landmark: {addr.landmark})</span>}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
                    <span className="text-gray-500">
                      Mobile: <strong className="text-gray-800">{addr.phone}</strong>
                    </span>

                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-gray-500 hover:text-[#2874f0] text-[11px] font-semibold underline cursor-pointer"
                      >
                        Set as Default Address
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

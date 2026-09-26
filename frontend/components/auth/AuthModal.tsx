/**
 * Flipkart Authentication Modal (Login / Sign Up)
 * Iconic Flipkart Split Banner with Live Validation & Quick Demo Logins
 */
import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, Phone, User as UserIcon, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { activeModal, setActiveModal, login, register, showToast } = useStore();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'customer' | 'admin'>('customer');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'auth') return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your Email or Mobile number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(emailOrPhone.trim(), password);
      setEmailOrPhone('');
      setPassword('');
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    const cleanPhone = signupPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: signupEmail.trim(),
        phone: cleanPhone,
        password: signupPassword,
        role: signupRole
      });
      setName('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupPassword('');
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (type: 'customer' | 'admin') => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      if (type === 'customer') {
        await login('ujjwal14022003@gmail.com', 'Customer@123');
      } else {
        await login('admin@flipkart.com', 'Admin@123');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="flipkart-auth-modal"
        className="bg-white w-full max-w-2xl rounded-md shadow-2xl overflow-hidden flex flex-col sm:flex-row relative min-h-[460px]"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setActiveModal(null);
            setErrorMsg('');
          }}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-900 bg-white/80 sm:bg-transparent rounded-full p-1 transition cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Left Side: Flipkart Iconic Blue Hero Banner (40%) */}
        <div className="sm:w-2/5 bg-[#2874f0] text-white p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {mode === 'login' ? 'Login' : 'Looks like you’re new here!'}
            </h3>
            <p className="text-xs text-blue-100 mt-3 leading-relaxed">
              {mode === 'login'
                ? 'Get access to your Orders, Wishlist, Saved Addresses and personalized Recommendations.'
                : 'Sign up with your mobile number and email to get started on Flipkart Marketplace.'}
            </p>
          </div>

          <div className="hidden sm:block mt-8">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={40} className="text-yellow-300" />
            </div>
            <p className="text-[11px] text-center text-blue-200">
              100% Safe & Secure Payments • Verified Flipkart Platform
            </p>
          </div>
        </div>

        {/* Right Side: Form & Quick Logins (60%) */}
        <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-gray-200 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 pb-2 text-xs font-bold transition cursor-pointer ${
                  mode === 'login'
                    ? 'text-[#2874f0] border-b-2 border-[#2874f0]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 pb-2 text-xs font-bold transition cursor-pointer ${
                  mode === 'signup'
                    ? 'text-[#2874f0] border-b-2 border-[#2874f0]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      id="input-login-email"
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. ujjwal@gmail.com or 9876500140"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none"
                    />
                    <Mail size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-700">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      id="input-login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none"
                    />
                    <Lock size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 leading-tight">
                  By continuing, you agree to Flipkart's{' '}
                  <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and{' '}
                  <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
                </p>

                <button
                  id="btn-auth-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#fb641b] hover:bg-[#e8560f] text-white font-extrabold py-2.5 rounded-xs text-xs uppercase tracking-wider shadow transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Login'}
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#2874f0] outline-none"
                    />
                    <UserIcon size={14} className="absolute left-2.5 top-2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#2874f0] outline-none"
                    />
                    <Mail size={14} className="absolute left-2.5 top-2 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 rounded focus:border-[#2874f0] outline-none"
                      />
                      <Phone size={13} className="absolute left-2 top-2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Account Role</label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value as any)}
                      className="w-full py-1.5 px-2 text-xs border border-gray-300 rounded focus:border-[#2874f0] outline-none bg-white"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Platform Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:border-[#2874f0] outline-none"
                    />
                    <Lock size={14} className="absolute left-2.5 top-2 text-gray-400" />
                  </div>
                </div>

                <button
                  id="btn-auth-signup-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#fb641b] hover:bg-[#e8560f] text-white font-extrabold py-2 rounded-xs text-xs uppercase tracking-wider shadow transition cursor-pointer disabled:opacity-50 mt-1"
                >
                  {isSubmitting ? 'Registering...' : 'Continue'}
                </button>
              </form>
            )}
          </div>

          {/* Quick Demo Credentials for Fast Audit Testing */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500" /> Quick Demo Accounts (One-Click Test)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                disabled={isSubmitting}
                className="p-1.5 border border-blue-200 bg-blue-50/60 hover:bg-blue-100 rounded text-left transition cursor-pointer"
              >
                <p className="text-[11px] font-bold text-[#2874f0]">Customer Demo</p>
                <p className="text-[9px] text-gray-500 truncate">ujjwal@gmail.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={isSubmitting}
                className="p-1.5 border border-purple-200 bg-purple-50/60 hover:bg-purple-100 rounded text-left transition cursor-pointer"
              >
                <p className="text-[11px] font-bold text-purple-700">Admin Demo</p>
                <p className="text-[9px] text-gray-500 truncate">admin@flipkart.com</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

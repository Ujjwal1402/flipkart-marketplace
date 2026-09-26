/**
 * Flipkart Enterprise Footer
 */
import React from 'react';
import { ShieldCheck, Truck, RefreshCw, HelpCircle, Award, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="flipkart-marketplace-footer" className="bg-[#172337] text-white mt-12 pt-10 text-xs">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 border-b border-gray-700/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-[#2874f0]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-sm">100% Original Products</h4>
              <p className="text-gray-400 text-xs mt-0.5">Sourced directly from verified brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-sm">7-Day Easy Replacement</h4>
              <p className="text-gray-400 text-xs mt-0.5">Hassle-free doorstep returns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Truck size={22} />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-sm">Free & Fast Delivery</h4>
              <p className="text-gray-400 text-xs mt-0.5">On all orders above ₹500</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
              <CreditCard size={22} />
            </div>
            <div>
              <h4 className="font-bold text-gray-200 text-sm">100% Secure Payments</h4>
              <p className="text-gray-400 text-xs mt-0.5">UPI, Cards, NetBanking & EMI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div>
          <h5 className="text-gray-400 font-semibold mb-3 uppercase tracking-wider text-[11px]">ABOUT</h5>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#about" className="hover:underline">Contact Us</a></li>
            <li><a href="#about" className="hover:underline">About Flipkart</a></li>
            <li><a href="#about" className="hover:underline">Careers</a></li>
            <li><a href="#about" className="hover:underline">Flipkart Stories</a></li>
            <li><a href="#about" className="hover:underline">Corporate Information</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-gray-400 font-semibold mb-3 uppercase tracking-wider text-[11px]">HELP</h5>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#help" className="hover:underline">Payments</a></li>
            <li><a href="#help" className="hover:underline">Shipping</a></li>
            <li><a href="#help" className="hover:underline">Cancellation & Returns</a></li>
            <li><a href="#help" className="hover:underline">FAQ & Help Center</a></li>
            <li><a href="#help" className="hover:underline">Report Infringement</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-gray-400 font-semibold mb-3 uppercase tracking-wider text-[11px]">CONSUMER POLICY</h5>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#policy" className="hover:underline">Cancellation & Returns</a></li>
            <li><a href="#policy" className="hover:underline">Terms Of Use</a></li>
            <li><a href="#policy" className="hover:underline">Security</a></li>
            <li><a href="#policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#policy" className="hover:underline">Grievance Redressal</a></li>
          </ul>
        </div>

        <div className="border-l border-gray-700/80 pl-0 md:pl-6 col-span-2">
          <h5 className="text-gray-400 font-semibold mb-2 uppercase tracking-wider text-[11px]">Registered Office Address:</h5>
          <p className="text-gray-400 leading-relaxed text-xs">
            Flipkart Internet Private Limited,<br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103, Karnataka, India<br />
            CIN: U51109KA2012PTC066107<br />
            Telephone: <span className="text-[#2874f0]">044-45614700 / 044-67415800</span>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6 bg-[#0f1724]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <Award size={14} /> Become a Seller
            </span>
            <span className="flex items-center gap-1 text-blue-400 font-semibold">
              <HelpCircle size={14} /> 24x7 Customer Care
            </span>
          </div>
          <div>
            © 2007-2026 Flipkart.com. Built with Separated Backend, Database & Frontend MVC Architecture.
          </div>
        </div>
      </div>
    </footer>
  );
};

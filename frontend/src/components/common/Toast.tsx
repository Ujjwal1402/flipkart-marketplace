/**
 * Toast Notification Component
 */
import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded shadow-lg text-xs font-semibold border transition-all ${
            t.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : t.type === 'error'
              ? 'bg-red-900 text-white border-red-700'
              : 'bg-gray-900 text-white border-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {t.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            ) : t.type === 'error' ? (
              <AlertCircle size={16} className="text-red-400 shrink-0" />
            ) : (
              <Info size={16} className="text-blue-400 shrink-0" />
            )}
            <span>{t.message}</span>
          </div>

          <button
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-white p-0.5 rounded transition cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

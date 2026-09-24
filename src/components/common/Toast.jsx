import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item">
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle size={18} className="text-rose-400" />}
          {toast.type === 'info' && <Info size={18} className="text-sky-400" />}
          <span style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A09B93',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex'
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

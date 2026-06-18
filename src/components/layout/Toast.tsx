'use client';

import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return { toasts, addToast };
}

export default function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[400] flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="glass px-5 py-3.5 flex items-center gap-3 animate-fadeIn"
          style={{
            borderLeft: `3px solid ${
              toast.type === 'success' ? '#63b388' : 
              toast.type === 'error' ? '#dc7864' : 
              'var(--accent)'
            }`,
            minWidth: '280px',
          }}
        >
          <span className="text-[18px]">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="text-[14px] font-medium" style={{ color: 'var(--fg)' }}>
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  );
}

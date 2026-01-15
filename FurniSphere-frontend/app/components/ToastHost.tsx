'use client';

import { useEffect, useState } from 'react';
import { ToastType } from '../lib/toast';

type Toast = { id: number; message: string; type: ToastType };

const typeStyles: Record<ToastType, string> = {
  info: 'bg-gray-900 text-white',
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
};

export default function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        message: string;
        type: ToastType;
      };
      if (!detail?.message) return;
      const id = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev,
        { id, message: detail.message, type: detail.type || 'info' },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener('app-toast', handler as EventListener);
    return () =>
      window.removeEventListener('app-toast', handler as EventListener);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 px-4 py-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full max-w-xs rounded-lg px-4 py-3 shadow-lg ${
            typeStyles[toast.type]
          }`}
        >
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

'use client';

export type ToastType = 'info' | 'success' | 'error';

export const emitToast = (message: string, type: ToastType = 'info') => {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('app-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

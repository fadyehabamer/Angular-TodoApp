import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration: number = 3000) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type,
      duration
    };
    this.toasts.update(toasts => [...toasts, toast]);

    // Auto remove
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: string) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }
}
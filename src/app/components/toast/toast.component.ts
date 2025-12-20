import { Component, inject } from '@angular/core';
import { ToastService, Toast } from '../../services/toast.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIconComponent } from '@/shared/components/icon';
import type { ZardIcon } from '@/shared/components/icon/icons';

@Component({
  selector: 'app-toast',
  imports: [ZardButtonComponent, ZardIconComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-right-2"
          [class]="toastClasses(toast.type)"
        >
          <z-icon [zType]="toastIcon(toast.type)" class="flex-shrink-0"></z-icon>
          <span class="flex-1">{{ toast.message }}</span>
          <z-button
            zType="ghost"
            zSize="sm"
            (click)="toastService.remove(toast.id)"
            class="text-current hover:bg-black/10"
          >
            <z-icon zType="x"></z-icon>
          </z-button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  toastClasses(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

  toastIcon(type: string): ZardIcon {
    switch (type) {
      case 'success': return 'check';
      case 'error': return 'triangle-alert';
      case 'info': return 'info';
      default: return 'info';
    }
  }
}
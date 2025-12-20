import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal<boolean>(false);

  constructor() {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) {
        this.isDark.set(stored === 'dark');
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDark.set(prefersDark);
      }

      // Save to localStorage
      effect(() => {
        localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', this.isDark());
      });
    }
  }

  toggle() {
    this.isDark.update(dark => !dark);
  }
}
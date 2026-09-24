import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDark = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = readStoredTheme();
      if (stored) {
        this.isDark.set(stored === 'dark');
      } else {
        // Fall back to the system preference. matchMedia is missing in some
        // environments (e.g. jsdom, older embedded webviews).
        this.isDark.set(window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
      }

      effect(() => {
        const theme = this.isDark() ? 'dark' : 'light';
        try {
          localStorage.setItem('theme', theme);
        } catch {
          // Storage can be unavailable (privacy mode, quota); the theme still applies.
        }
        document.documentElement.classList.toggle('dark', this.isDark());
      });
    }
  }

  toggle() {
    this.isDark.update(dark => !dark);
  }
}

function readStoredTheme(): string | null {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

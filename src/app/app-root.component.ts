import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, ToastComponent],
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 transition-colors">
      <router-outlet></router-outlet>
      <app-toast></app-toast>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AppRoot {
  themeService = inject(ThemeService);
}

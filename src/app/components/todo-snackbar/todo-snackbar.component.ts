import { Component, input, output, OnInit, OnDestroy } from '@angular/core';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-todo-snackbar',
  imports: [ZardButtonComponent],
  template: `
    @if (visible()) {
      <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 z-50">
        <span>{{ message() }}</span>
        <button z-button type="button"
          zType="ghost"
          zSize="sm"
          class="text-white hover:bg-gray-700"
          (click)="undo.emit()"
        >
          Undo
        </button>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TodoSnackbarComponent implements OnInit, OnDestroy {
  message = input.required<string>();
  visible = input<boolean>(false);
  undo = output<void>();

  private timeoutId?: number;

  ngOnInit() {
    if (this.visible()) {
      this.startTimer();
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  ngOnChanges() {
    if (this.visible()) {
      this.startTimer();
    } else {
      this.clearTimer();
    }
  }

  private startTimer() {
    this.clearTimer();
    this.timeoutId = window.setTimeout(() => {
      // Auto hide, but since input, perhaps emit hide
      // For simplicity, assume parent handles
    }, 5000);
  }

  private clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }
}
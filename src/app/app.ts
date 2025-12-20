import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TodoService, FilterType } from './services/todo.service';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFiltersComponent } from './components/todo-filters/todo-filters.component';
import { TodoSnackbarComponent } from './components/todo-snackbar/todo-snackbar.component';
import { ToastComponent } from './components/toast/toast.component';
import { Todo } from './models/todo.model';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIconComponent } from '@/shared/components/icon';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ToastService } from './services/toast.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    TodoItemComponent,
    TodoFiltersComponent,
    TodoSnackbarComponent,
    ToastComponent,
    ZardCardComponent,
    ZardButtonComponent,
    ZardIconComponent,
    ZardEmptyComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Todos</h1>
          <div class="flex gap-2">
            <z-button zType="outline" routerLink="/" title="Home">
              <z-icon zType="house"></z-icon>
            </z-button>
            <z-button zType="outline" (click)="showShortcuts()" title="Keyboard shortcuts">
              <z-icon zType="info"></z-icon>
            </z-button>
            <z-button zType="default" (click)="goToAdd()">
              <z-icon zType="plus"></z-icon>
              Add Todo
            </z-button>
            <z-button zType="outline" (click)="goToAnalytics()">
              <z-icon zType="layout-dashboard"></z-icon>
              Analytics
            </z-button>
            <z-button
              zType="outline"
              (click)="toggleTheme()"
            >
              <z-icon [zType]="themeService.isDark() ? 'sun' : 'moon'"></z-icon>
            </z-button>
          </div>
        </div>

        <z-card>
          <app-todo-filters
            [filter]="todoService.filterSignal()"
            [totalCount]="todoService.getTodos().length"
            [activeCount]="todoService.getActiveCount()"
            [completedCount]="todoService.getCompletedCount()"
            (filterChange)="onFilterChange($event)"
            (searchChange)="onSearchChange($event)"
          ></app-todo-filters>

          @if (filteredTodos().length === 0) {
            @if (todoService.getTodos().length === 0) {
              <z-empty
                zIcon="inbox"
                zTitle="No todos yet"
                zDescription="Create your first todo to get started"
              >
                <div class="flex justify-center pt-4">
                  <z-button zType="default" routerLink="/add">
                    <z-icon zType="plus" class="mr-2"></z-icon>
                    Create Todo
                  </z-button>
                </div>
              </z-empty>
            } @else {
              <z-empty
                zIcon="search"
                zTitle="No todos match"
                zDescription="Try adjusting your search or filters"
              ></z-empty>
            }
          } @else {
            <div class="space-y-2">
              @for (todo of filteredTodos(); track todo.id) {
                <app-todo-item
                  [todo]="todo"
                  (toggle)="onToggleTodo($event)"
                  (delete)="onDeleteTodo($event)"
                  (edit)="goToEdit($event)"
                ></app-todo-item>
              }
            </div>
          }
        </z-card>

        <app-todo-snackbar
          message="Todo deleted"
          [visible]="showSnackbar()"
          (undo)="onUndoDelete()"
        ></app-todo-snackbar>

        <app-toast></app-toast>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {
  private router = inject(Router);
  private alertDialogService = inject(ZardAlertDialogService);
  todoService = inject(TodoService);
  toastService = inject(ToastService);
  themeService = inject(ThemeService);

  editingTodo = signal<Todo | null>(null);
  showSnackbar = signal<boolean>(false);

  filteredTodos = computed(() => this.todoService.filteredTodos());

  goToAdd() {
    this.router.navigate(['/add']);
  }

  goToEdit(id: string) {
    this.router.navigate(['/edit', id]);
  }

  goToAnalytics() {
    this.router.navigate(['/analytics']);
  }

  onToggleTodo(id: string) {
    this.todoService.toggleTodo(id);
    this.toastService.info('Todo status updated');
  }

  onDeleteTodo(id: string) {
    this.alertDialogService.confirm({
      zTitle: 'Delete Todo?',
      zDescription: 'Are you sure you want to delete this todo? This action cannot be undone.',
      zOkText: 'Delete',
      zOkDestructive: true,
      zCancelText: 'Cancel',
      zOnOk: () => {
        this.todoService.deleteTodo(id);
        this.showSnackbar.set(true);
        this.toastService.error('Todo deleted');
        setTimeout(() => this.showSnackbar.set(false), 5000);
      }
    });
  }

  onUndoDelete() {
    this.todoService.undoDelete();
    this.showSnackbar.set(false);
  }

  onFilterChange(filter: FilterType) {
    this.todoService.filterSignal.set(filter);
  }

  onSearchChange(search: string) {
    this.todoService.searchSignal.set(search);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  showShortcuts() {
    this.alertDialogService.info({
      zTitle: 'Keyboard Shortcuts',
      zDescription: 'Learn how to use keyboard shortcuts to navigate faster',
      zContent: `
        <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div class="flex justify-between">
            <span class="font-medium">Add Todo</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Ctrl + Alt + N</kbd>
          </div>
      
          <div class="flex justify-between">
            <span class="font-medium">Search</span>
            <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Ctrl + F</kbd>
          </div>
        </div>
      `
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl/Cmd + Alt + N: Add new todo
    if ((event.ctrlKey || event.metaKey) && event.altKey && event.key === 'n') {
      event.preventDefault();
      this.goToAdd();
    }
    // Ctrl/Cmd + Shift + N: Open new tab
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'N') {
      event.preventDefault();
      window.open('', '_blank');
    }
    // Ctrl/Cmd + F: Focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  }
}

import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';
import { ToastService } from '../../services/toast.service';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIconComponent } from '@/shared/components/icon';
import { TodoFormValue } from '../../models/todo.model';

@Component({
  selector: 'app-add-todo-page',
  imports: [RouterModule, TodoFormComponent, ZardCardComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8 flex items-center gap-4">
          <z-button zType="outline" (click)="goBack()">
            <z-icon zType="arrow-left"></z-icon>
          </z-button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Add New Todo</h1>
          <z-button zType="outline" routerLink="/" class="ml-auto">
            <z-icon zType="house"></z-icon>
            Home
          </z-button>
        </div>

        <z-card class="p-8">
          <div class="mb-6">
            <p class="text-gray-600 dark:text-gray-400">
              Create a new task to stay organized and productive.
            </p>
          </div>
          <app-todo-form
            [editing]="null"
            (add)="onAddTodo($event)"
            (cancel)="goBack()"
          ></app-todo-form>
        </z-card>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AddTodoPageComponent {
  private router = inject(Router);
  private todoService = inject(TodoService);
  private toastService = inject(ToastService);

  onAddTodo({ text, category, priority, dueDate }: TodoFormValue) {
    this.todoService.addTodo(text, category, priority, dueDate);
    this.toastService.success('Todo added successfully!');
    setTimeout(() => {
      this.router.navigate(['/todos']);
    }, 100);
  }

  goBack() {
    this.router.navigate(['/todos']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';
import { ToastService } from '../../services/toast.service';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIconComponent } from '@/shared/components/icon';
import { Todo, TodoFormValue } from '../../models/todo.model';

@Component({
  selector: 'app-edit-todo-page',
  imports: [RouterModule, TodoFormComponent, ZardCardComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8 flex items-center gap-4">
          <button z-button type="button" zType="outline" (click)="goBack()" aria-label="Back to todos">
            <z-icon zType="arrow-left"></z-icon>
          </button>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Todo</h1>
          <a z-button zType="outline" routerLink="/" class="ml-auto">
            <z-icon zType="house"></z-icon>
            Home
          </a>
        </div>

        <z-card class="p-8">
          <div class="mb-6">
            <p class="text-gray-600 dark:text-gray-400">
              Update your task details below.
            </p>
          </div>
          <app-todo-form
            [editing]="editingTodo"
            (update)="onUpdateTodo($event)"
            (cancel)="goBack()"
          ></app-todo-form>
        </z-card>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class EditTodoPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private todoService = inject(TodoService);
  private toastService = inject(ToastService);

  editingTodo: Todo | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const todo = this.todoService.getTodos().find(t => t.id === id);
      if (todo) {
        this.editingTodo = todo;
      } else {
        this.toastService.error('Todo not found');
        this.goBack();
      }
    }
  }

  onUpdateTodo({ id, text, category, priority, dueDate }: TodoFormValue & { id: string }) {
    this.todoService.updateTodo(id, { text, category, priority, dueDate });
    this.toastService.success('Todo updated successfully!');
    this.router.navigate(['/todos']);
  }

  goBack() {
    this.router.navigate(['/todos']);
  }
}

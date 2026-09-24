import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIconComponent } from '@/shared/components/icon';

@Component({
  selector: 'app-todo-item',
  imports: [DatePipe, ZardCheckboxComponent, ZardButtonComponent, ZardIconComponent],
  template: `
    <div class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group" (click)="onCheckboxClick()">
      <z-checkbox
        [checked]="todo().completed"
        (checkedChange)="onToggle()"
        class="flex-shrink-0 pointer-events-none"
      ></z-checkbox>

      <div class="flex-1">
        <span
          class="block text-gray-900 dark:text-white"
          [class.line-through]="todo().completed"
          [class.text-gray-500]="todo().completed"
        >
          {{ todo().text }}
        </span>
        @if (todo().category && todo().category.length > 0) {
          @for (cat of todo().category; track cat) {
            <span class="inline-block mt-1 mr-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {{ cat }}
            </span>
          }
        }
        <span class="inline-block mt-1 ml-2 px-2 py-1 text-xs rounded"
              [class]="priorityClass(todo().priority)">
          {{ todo().priority }}
        </span>
        @if (todo().dueDate; as due) {
          <span class="inline-block mt-1 ml-2 px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            Due {{ due | date: 'mediumDate' }}
          </span>
        }
      </div>

      <button z-button type="button"
        zType="ghost"
        zSize="sm"
        (click)="edit.emit(todo().id); $event.stopPropagation()"
        [attr.aria-label]="'Edit ' + todo().text"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <z-icon zType="settings"></z-icon>
      </button>

      <button z-button type="button"
        zType="ghost"
        zSize="sm"
        (click)="delete.emit(todo().id); $event.stopPropagation()"
        [attr.aria-label]="'Delete ' + todo().text"
        class="text-gray-400 hover:text-red-600"
      >
        <z-icon zType="trash"></z-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggle = output<string>();
  edit = output<string>();
  delete = output<string>();

  onToggle() {
    this.toggle.emit(this.todo().id);
  }

  onCheckboxClick() {
    this.toggle.emit(this.todo().id);
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }
}
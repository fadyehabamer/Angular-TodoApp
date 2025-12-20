import { Component, input, output, ElementRef, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIconComponent } from '@/shared/components/icon';
import { ZardSelectComponent } from '@/shared/components/select/select.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule, ZardInputDirective, ZardButtonComponent, ZardIconComponent, ZardSelectComponent, ZardSelectItemComponent, ZardDatePickerComponent],
  template: `
    <form (ngSubmit)="onSubmit()" class="space-y-6">
      <!-- Task Input -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Task Description
        </label>
        <input
          #inputEl
          z-input
          [(ngModel)]="text"
          name="text"
          placeholder="What needs to be done?"
          (keydown.enter)="onSubmit()"
          (keydown.escape)="onCancel()"
          class="w-full"
          autocomplete="off"
          required
        />
      </div>

      <!-- Categories and Priority Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Categories -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categories
          </label>
          <z-select
            [zValue]="selectedCategories"
            (zValueChange)="onCategoryChange($event)"
            [zMultiple]="true"
            zPlaceholder="Select categories"
            class="w-full"
          >
            @for (cat of availableCategories; track cat) {
              <z-select-item [zValue]="cat">
                <div class="flex items-center gap-2 w-full">
                  <z-icon [zType]="categoryIcon(cat)" class="text-blue-600 flex-shrink-0"></z-icon>
                  <span class="capitalize">{{ cat }}</span>
                </div>
              </z-select-item>
            }
          </z-select>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Select one or more categories</p>
        </div>

        <!-- Priority -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <div class="grid grid-cols-3 gap-2">
            @for (pri of ['low', 'medium', 'high']; track pri) {
              <label class="relative">
                <input
                  type="radio"
                  name="priority"
                  [value]="pri"
                  [(ngModel)]="selectedPriority"
                  [ngModelOptions]="{standalone: true}"
                  class="sr-only peer"
                  aria-label="Select priority {{ pri }}"
                />
                <div class="flex items-center justify-center px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm capitalize cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:text-blue-700 dark:peer-checked:text-blue-300 hover:border-gray-300 dark:hover:border-gray-600">
                  @if (pri === 'high') {
                    <z-icon zType="zap" class="mr-1 text-red-500"></z-icon>
                  } @else if (pri === 'medium') {
                    <z-icon zType="minus" class="mr-1 text-yellow-500"></z-icon>
                  } @else {
                    <z-icon zType="chevron-down" class="mr-1 text-green-500"></z-icon>
                  }
                  {{ pri }}
                </div>
              </label>
            }
          </div>
        </div>
      </div>

      <!-- Due Date -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Date (Optional)
        </label>
        <z-date-picker 
          [(ngModel)]="dueDate"
          name="dueDate"
          class="w-full"
          zPlaceholder="Select a date"
        ></z-date-picker>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose when you want to complete this task</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <z-button
          type="button"
          (click)="onSubmit()"
          [disabled]="!text.trim()"
          zType="default"
          class="flex-1 sm:flex-none"
        >
          <z-icon zType="plus" class="mr-2"></z-icon>
          {{ editing() ? 'Update Task' : 'Add Task' }}
        </z-button>

        @if (editing()) {
          <z-button
            type="button"
            zType="outline"
            (click)="onCancel()"
            class="flex-1 sm:flex-none"
          >
            <z-icon zType="x" class="mr-2"></z-icon>
            Cancel
          </z-button>
        }
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Custom radio button styling */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Form validation styling */
    input:invalid:not(:placeholder-shown) {
      border-color: #ef4444;
    }

    input:invalid:not(:placeholder-shown) + label::after {
      content: 'Required';
      color: #ef4444;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
  `]
})
export class TodoFormComponent implements AfterViewInit, OnInit {
  editing = input<Todo | null>(null);
  add = output<{ text: string; category: string[]; priority: 'low' | 'medium' | 'high' }>();
  update = output<{ id: string; text: string; category: string[]; priority: 'low' | 'medium' | 'high' }>();
  cancel = output<void>();

  text: string = '';
  selectedCategories: string[] = [];
  selectedPriority: 'low' | 'medium' | 'high' = 'medium';

  availableCategories = ['work', 'personal', 'shopping', 'health', 'fitness', 'learning', 'urgent', 'hobby'];
  dueDate: string = '';
  categoryIcon(cat: string): 'clipboard' | 'user' | 'tag' | 'heart' | 'zap' | 'book-open' | 'lightbulb' | 'star' {
    switch (cat) {
      case 'work': return 'clipboard';
      case 'personal': return 'user';
      case 'shopping': return 'tag';
      case 'health': return 'heart';
      case 'fitness': return 'zap';
      case 'learning': return 'book-open';
      case 'urgent': return 'lightbulb';
      case 'hobby': return 'star';
      default: return 'clipboard';
    }
  }

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  toastService = inject(ToastService);

  ngAfterViewInit() {
    this.inputEl.nativeElement.focus();
  }

  ngOnInit() {
    const editingTodo = this.editing();
    if (editingTodo) {
      this.text = editingTodo.text;
      this.selectedCategories = Array.isArray(editingTodo.category) ? [...editingTodo.category] : [];
      this.selectedPriority = editingTodo.priority;
    }
  }

  onTextInput(event: Event) {
    this.text = (event.target as HTMLInputElement).value;
  }

  onCategoriesChange(categories: any) {
    console.log('Categories changed:', categories);
    this.selectedCategories = Array.isArray(categories) ? categories : [];
  }

  onCategoryChange(value: string | string[]) {
    console.log('Category changed:', value);
    this.selectedCategories = Array.isArray(value) ? value : [];
  }

  onCategoryToggle(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    } else {
      this.selectedCategories = [...this.selectedCategories, category];
    }
    console.log('Categories after toggle:', this.selectedCategories);
  }

  onPriorityChange(event: Event) {
    this.selectedPriority = (event.target as HTMLSelectElement).value as 'low' | 'medium' | 'high';
  }

  onSubmit() {
    const trimmed = this.text.trim();
    if (!trimmed) {
      this.toastService.error('Todo text cannot be empty');
      return;
    }
    console.log('Selected Categories:', this.selectedCategories);
    if (this.selectedCategories.length === 0) {
      this.toastService.error('Select at least one category');
      return;
    }
    if (this.editing()) {
      this.update.emit({ 
        id: this.editing()!.id, 
        text: trimmed, 
        category: this.selectedCategories, 
        priority: this.selectedPriority 
      });
    } else {
      console.log('Emitting add with categories:', this.selectedCategories);
      this.add.emit({ text: trimmed, category: this.selectedCategories, priority: this.selectedPriority });
    }
  }

  onCancel() {
    this.text = '';
    this.selectedCategories = [];
    this.selectedPriority = 'medium';
    this.cancel.emit();
  }
}
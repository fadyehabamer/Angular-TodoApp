import { Component, input, output, signal } from '@angular/core';
import { FilterType } from '../../services/todo.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'app-todo-filters',
  imports: [ZardButtonComponent, ZardInputDirective],
  template: `
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="flex gap-2">
        <button z-button type="button"
          [zType]="filter() === 'all' ? 'default' : 'outline'"
          [attr.aria-pressed]="filter() === 'all'"
          zSize="sm"
          (click)="filterChange.emit('all')"
        >
          All ({{ totalCount() }})
        </button>

        <button z-button type="button"
          [zType]="filter() === 'active' ? 'default' : 'outline'"
          [attr.aria-pressed]="filter() === 'active'"
          zSize="sm"
          (click)="filterChange.emit('active')"
        >
          Active ({{ activeCount() }})
        </button>

        <button z-button type="button"
          [zType]="filter() === 'completed' ? 'default' : 'outline'"
          [attr.aria-pressed]="filter() === 'completed'"
          zSize="sm"
          (click)="filterChange.emit('completed')"
        >
          Completed ({{ completedCount() }})
        </button>
      </div>

      <div class="flex-1 max-w-md">
        <input
          z-input
          type="search"
          aria-label="Search todos"
          [value]="searchText()"
          (input)="onSearchInput($event)"
          placeholder="Search todos..."
          class="w-full"
        />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TodoFiltersComponent {
  filter = input.required<FilterType>();
  totalCount = input.required<number>();
  activeCount = input.required<number>();
  completedCount = input.required<number>();
  filterChange = output<FilterType>();
  searchChange = output<string>();

  searchText = signal<string>('');

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.searchChange.emit(value);
  }
}
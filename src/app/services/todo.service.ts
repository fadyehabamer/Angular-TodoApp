import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo } from '../models/todo.model';

export type FilterType = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'todos';
const PRIORITIES: readonly Todo['priority'][] = ['low', 'medium', 'high'];

/** Reads todos from localStorage, dropping anything that is not a usable todo. */
function loadTodos(): Todo[] {
  let parsed: unknown;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    parsed = JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load todos from localStorage', e);
    return [];
  }
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter((t): t is Partial<Record<keyof Todo, any>> => !!t && typeof t === 'object' && typeof t.text === 'string')
    .map(t => {
      const createdAt = new Date(t.createdAt ?? Date.now());
      return {
        id: typeof t.id === 'string' && t.id ? t.id : crypto.randomUUID(),
        text: t.text,
        completed: t.completed === true,
        createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
        category: Array.isArray(t.category)
          ? t.category.filter((c: unknown): c is string => typeof c === 'string')
          : typeof t.category === 'string' && t.category ? [t.category] : [],
        priority: PRIORITIES.includes(t.priority) ? t.priority : 'medium'
      };
    });
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // State signals
  private todosSignal = signal<Todo[]>([]);
  filterSignal = signal<FilterType>('all');
  searchSignal = signal<string>('');
  recentDeletedSignal = signal<Todo | null>(null);
  private recentDeletedIndex = 0;

  // Computed signals
  filteredTodos = computed(() => {
    const todos = this.todosSignal();
    const filter = this.filterSignal();
    const search = this.searchSignal().toLowerCase();

    let filtered = todos;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Apply search
    if (search) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(search)
      );
    }

    return filtered;
  });

  // Load from localStorage on init
  constructor() {
    if (typeof window !== 'undefined') {
      this.todosSignal.set(loadTodos());
    }

    // Save to localStorage whenever todos change
    effect(() => {
      if (typeof window !== 'undefined') {
        const todos = this.todosSignal();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (e) {
          // Quota exceeded or storage disabled: keep working in memory.
          console.error('Failed to save todos to localStorage', e);
        }
      }
    });
  }

  // CRUD operations
  addTodo(text: string, category: string[], priority: 'medium' | 'low' | 'high' = 'medium'): void {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: new Date(),
      category: Array.isArray(category) ? category.map(c => c.trim()).filter(Boolean) : [],
      priority
    };
    this.todosSignal.update(todos => [...todos, newTodo]);
  }

  updateTodo(id: string, updates: Partial<Pick<Todo, 'text' | 'completed' | 'category' | 'priority'>>): void {
    this.todosSignal.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  }

  deleteTodo(id: string): void {
    const todos = this.todosSignal();
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.recentDeletedSignal.set(todos[index]);
      this.recentDeletedIndex = index;
      this.todosSignal.update(todos => todos.filter(t => t.id !== id));
    }
  }

  toggleTodo(id: string): void {
    this.updateTodo(id, { completed: !this.todosSignal().find(t => t.id === id)?.completed });
  }

  undoDelete(): void {
    const deleted = this.recentDeletedSignal();
    if (deleted) {
      // Put the todo back where it was instead of at the end of the list.
      this.todosSignal.update(todos => {
        const restored = [...todos];
        restored.splice(Math.min(this.recentDeletedIndex, restored.length), 0, deleted);
        return restored;
      });
      this.recentDeletedSignal.set(null);
    }
  }

  // Getters
  getTodos(): Todo[] {
    return this.todosSignal();
  }

  getActiveCount(): number {
    return this.todosSignal().filter(t => !t.completed).length;
  }

  getCompletedCount(): number {
    return this.todosSignal().filter(t => t.completed).length;
  }
}
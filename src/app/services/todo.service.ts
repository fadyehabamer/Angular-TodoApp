import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo } from '../models/todo.model';

export type FilterType = 'all' | 'active' | 'completed';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // State signals
  private todosSignal = signal<Todo[]>([]);
  filterSignal = signal<FilterType>('all');
  searchSignal = signal<string>('');
  recentDeletedSignal = signal<Todo | null>(null);

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
      const stored = localStorage.getItem('todos');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const todos = parsed.map((t: any) => ({
            id: t.id || crypto.randomUUID(),
            text: t.text || '',
            completed: t.completed || false,
            createdAt: new Date(t.createdAt || Date.now()),
            category: Array.isArray(t.category) ? t.category : (t.category ? [t.category] : []),
            priority: t.priority || 'medium'
          }));
          this.todosSignal.set(todos);
        } catch (e) {
          console.error('Failed to load todos from localStorage', e);
        }
      }
    }

    // Save to localStorage whenever todos change
    effect(() => {
      if (typeof window !== 'undefined') {
        const todos = this.todosSignal();
        localStorage.setItem('todos', JSON.stringify(todos));
      }
    });
  }

  // CRUD operations
  addTodo(text: string, category: string[], priority: 'medium' | 'low' | 'high' = 'medium'): void {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      category: Array.isArray(category) ? category.filter(c => c.trim()) : [],
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
    const todoToDelete = todos.find(t => t.id === id);
    if (todoToDelete) {
      this.recentDeletedSignal.set(todoToDelete);
      this.todosSignal.update(todos => todos.filter(t => t.id !== id));
    }
  }

  toggleTodo(id: string): void {
    this.updateTodo(id, { completed: !this.todosSignal().find(t => t.id === id)?.completed });
  }

  undoDelete(): void {
    const deleted = this.recentDeletedSignal();
    if (deleted) {
      this.todosSignal.update(todos => [...todos, deleted]);
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
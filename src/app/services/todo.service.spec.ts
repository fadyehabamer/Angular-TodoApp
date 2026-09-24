import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  function createService(): TodoService {
    return TestBed.inject(TodoService);
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  describe('adding todos', () => {
    it('adds a trimmed todo with defaults', () => {
      const service = createService();
      service.addTodo('  Buy milk  ', ['shopping']);

      const [todo] = service.getTodos();
      expect(todo.text).toBe('Buy milk');
      expect(todo.completed).toBe(false);
      expect(todo.priority).toBe('medium');
      expect(todo.category).toEqual(['shopping']);
      expect(todo.dueDate).toBeNull();
      expect(todo.id).toBeTruthy();
    });

    it('ignores blank text', () => {
      const service = createService();
      service.addTodo('   ', ['work']);
      expect(service.getTodos()).toEqual([]);
    });

    it('trims categories and drops empty ones', () => {
      const service = createService();
      service.addTodo('Task', [' work ', '', '  ']);
      expect(service.getTodos()[0].category).toEqual(['work']);
    });

    it('stores priority and due date', () => {
      const service = createService();
      const due = new Date('2030-01-15T00:00:00Z');
      service.addTodo('Task', ['work'], 'high', due);

      const [todo] = service.getTodos();
      expect(todo.priority).toBe('high');
      expect(todo.dueDate).toEqual(due);
    });
  });

  describe('updating and toggling', () => {
    it('updates only the targeted todo', () => {
      const service = createService();
      service.addTodo('First', ['work']);
      service.addTodo('Second', ['work']);
      const [first, second] = service.getTodos();

      service.updateTodo(first.id, { text: 'First (edited)', priority: 'low' });

      const [updatedFirst, untouchedSecond] = service.getTodos();
      expect(updatedFirst.text).toBe('First (edited)');
      expect(updatedFirst.priority).toBe('low');
      expect(untouchedSecond).toEqual(second);
    });

    it('toggles completion and updates the counts', () => {
      const service = createService();
      service.addTodo('A', ['work']);
      service.addTodo('B', ['work']);
      const id = service.getTodos()[0].id;

      service.toggleTodo(id);
      expect(service.getTodos()[0].completed).toBe(true);
      expect(service.getCompletedCount()).toBe(1);
      expect(service.getActiveCount()).toBe(1);

      service.toggleTodo(id);
      expect(service.getTodos()[0].completed).toBe(false);
      expect(service.getCompletedCount()).toBe(0);
    });
  });

  describe('deleting and undo', () => {
    it('removes the todo and remembers it for undo', () => {
      const service = createService();
      service.addTodo('Keep', ['work']);
      service.addTodo('Remove', ['work']);
      const removed = service.getTodos()[1];

      service.deleteTodo(removed.id);

      expect(service.getTodos().map(t => t.text)).toEqual(['Keep']);
      expect(service.recentDeletedSignal()).toEqual(removed);
    });

    it('restores an undone todo at its original position', () => {
      const service = createService();
      service.addTodo('One', ['work']);
      service.addTodo('Two', ['work']);
      service.addTodo('Three', ['work']);
      const middle = service.getTodos()[1];

      service.deleteTodo(middle.id);
      service.undoDelete();

      expect(service.getTodos().map(t => t.text)).toEqual(['One', 'Two', 'Three']);
      expect(service.recentDeletedSignal()).toBeNull();
    });

    it('ignores unknown ids', () => {
      const service = createService();
      service.addTodo('One', ['work']);
      service.deleteTodo('does-not-exist');
      expect(service.getTodos().length).toBe(1);
      expect(service.recentDeletedSignal()).toBeNull();
    });
  });

  describe('filtering', () => {
    it('filters by status and search text (case-insensitive)', () => {
      const service = createService();
      service.addTodo('Buy milk', ['shopping']);
      service.addTodo('Write report', ['work']);
      service.addTodo('Buy bread', ['shopping']);
      service.toggleTodo(service.getTodos()[0].id);

      service.filterSignal.set('active');
      expect(service.filteredTodos().map(t => t.text)).toEqual(['Write report', 'Buy bread']);

      service.filterSignal.set('completed');
      expect(service.filteredTodos().map(t => t.text)).toEqual(['Buy milk']);

      service.filterSignal.set('all');
      service.searchSignal.set('BUY');
      expect(service.filteredTodos().map(t => t.text)).toEqual(['Buy milk', 'Buy bread']);
    });
  });

  describe('persistence', () => {
    it('saves todos to localStorage', () => {
      const service = createService();
      service.addTodo('Persist me', ['work'], 'high');
      TestBed.tick();

      const stored = JSON.parse(localStorage.getItem('todos')!);
      expect(stored).toHaveLength(1);
      expect(stored[0].text).toBe('Persist me');
      expect(stored[0].priority).toBe('high');
    });

    it('loads and normalises stored todos', () => {
      localStorage.setItem(
        'todos',
        JSON.stringify([
          {
            id: 'a',
            text: 'Legacy',
            completed: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            category: 'work',
            priority: 'urgent',
            dueDate: '2024-02-01T00:00:00.000Z'
          },
          { id: 'b', completed: false },
          null
        ])
      );

      const todos = createService().getTodos();

      expect(todos).toHaveLength(1);
      expect(todos[0]).toEqual({
        id: 'a',
        text: 'Legacy',
        completed: true,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        category: ['work'],
        priority: 'medium',
        dueDate: new Date('2024-02-01T00:00:00.000Z')
      });
    });

    it('starts empty when stored data is corrupt', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('todos', '{not json');
      expect(createService().getTodos()).toEqual([]);

      TestBed.resetTestingModule();
      localStorage.setItem('todos', JSON.stringify({ not: 'an array' }));
      expect(createService().getTodos()).toEqual([]);
      errorSpy.mockRestore();
    });
  });
});

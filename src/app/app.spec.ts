import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { TodoService } from './services/todo.service';

describe('App (todo list page)', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the page heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('My Todos');
  });

  it('shows the empty state when there are no todos', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No todos yet');
  });

  it('lists todos from the service and updates the filter counts', async () => {
    const service = TestBed.inject(TodoService);
    service.addTodo('Buy milk', ['shopping']);
    service.addTodo('Write report', ['work']);
    service.toggleTodo(service.getTodos()[0].id);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('app-todo-item').length).toBe(2);
    expect(el.textContent).toContain('All (2)');
    expect(el.textContent).toContain('Active (1)');
    expect(el.textContent).toContain('Completed (1)');
  });

  it('uses keyboard-accessible native buttons with labels for icon-only actions', async () => {
    const service = TestBed.inject(TodoService);
    service.addTodo('Buy milk', ['shopping']);

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('z-button')).toBeNull();
    expect(el.querySelector('button[aria-label="Edit Buy milk"]')).not.toBeNull();
    expect(el.querySelector('button[aria-label="Delete Buy milk"]')).not.toBeNull();
    expect(el.querySelector('button[aria-label="Switch to dark mode"]')).not.toBeNull();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { ToastService } from '../../services/toast.service';
import { Todo, TodoFormValue } from '../../models/todo.model';

describe('TodoFormComponent', () => {
  let fixture: ComponentFixture<TodoFormComponent>;
  let component: TodoFormComponent;
  let toast: { error: ReturnType<typeof vi.fn> };
  let added: TodoFormValue[];
  let updated: (TodoFormValue & { id: string })[];

  async function setup(editing: Todo | null = null) {
    toast = { error: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
      providers: [{ provide: ToastService, useValue: toast }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    fixture.componentRef.setInput('editing', editing);
    component = fixture.componentInstance;
    added = [];
    updated = [];
    component.add.subscribe(value => added.push(value));
    component.update.subscribe(value => updated.push(value));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function submitForm() {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
  }

  it('emits add once with trimmed text, categories, priority and due date', async () => {
    await setup();
    const due = new Date('2030-05-01T00:00:00Z');
    component.text = '  Write tests  ';
    component.selectedCategories = ['work'];
    component.selectedPriority = 'high';
    component.dueDate = due;

    submitForm();

    expect(added).toEqual([{ text: 'Write tests', category: ['work'], priority: 'high', dueDate: due }]);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('rejects empty text', async () => {
    await setup();
    component.text = '   ';
    component.selectedCategories = ['work'];

    submitForm();

    expect(added).toEqual([]);
    expect(toast.error).toHaveBeenCalledWith('Todo text cannot be empty');
  });

  it('requires at least one category', async () => {
    await setup();
    component.text = 'Task';
    component.selectedCategories = [];

    submitForm();

    expect(added).toEqual([]);
    expect(toast.error).toHaveBeenCalledWith('Select at least one category');
  });

  it('does not submit when Enter is pressed via a key handler (handled by the form)', async () => {
    await setup();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#todo-text');
    component.text = 'Task';
    component.selectedCategories = ['work'];

    // A synthetic keydown does not trigger implicit submission, so nothing
    // should be emitted unless a dedicated Enter handler exists.
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(added).toEqual([]);
  });

  it('prefills the fields and emits update when editing', async () => {
    const due = new Date('2030-01-01T00:00:00Z');
    await setup({
      id: 'todo-1',
      text: 'Existing',
      completed: false,
      createdAt: new Date(),
      category: ['personal'],
      priority: 'low',
      dueDate: due,
    });

    expect(component.text).toBe('Existing');
    expect(component.selectedCategories).toEqual(['personal']);
    expect(component.selectedPriority).toBe('low');
    expect(component.dueDate).toEqual(due);

    component.text = 'Existing (edited)';
    submitForm();

    expect(updated).toEqual([
      { id: 'todo-1', text: 'Existing (edited)', category: ['personal'], priority: 'low', dueDate: due },
    ]);
    expect(added).toEqual([]);
  });

  it('labels the task input', async () => {
    await setup();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label[for="todo-text"]');
    expect(label.textContent?.trim()).toBe('Task Description');
  });
});

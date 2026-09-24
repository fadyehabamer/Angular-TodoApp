export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category: string[];
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | null;
}

/** Values produced by the todo form when creating or editing a todo. */
export interface TodoFormValue {
  text: string;
  category: string[];
  priority: Todo['priority'];
  dueDate: Date | null;
}

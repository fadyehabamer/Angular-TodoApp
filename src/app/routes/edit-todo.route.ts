import { Route } from '@angular/router';
import { EditTodoPageComponent } from '../components/edit-todo-page/edit-todo-page.component';

export const editTodoRoute: Route = {
  path: 'edit/:id',
  component: EditTodoPageComponent
};

import { Routes } from '@angular/router';
import { App } from '../app';
import { editTodoRoute } from './edit-todo.route';
import { landingRoute } from './landing.route';
import { analyticsRoute } from './analytics.route';
import { addTodoRoute } from './add-todo.route';

export const appRoutes: Routes = [
  landingRoute,
  { path: 'todos', component: App },
  addTodoRoute,
  editTodoRoute,
  analyticsRoute,
];

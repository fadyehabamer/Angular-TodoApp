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
  // Unknown URLs go back to the landing page instead of rendering a blank screen.
  { path: '**', redirectTo: '' },
];

import { Component, computed, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardIconComponent } from '@/shared/components/icon';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'app-analytics',
  imports: [RouterModule, ZardCardComponent, ZardIconComponent, ZardButtonComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <z-button zType="outline" (click)="goBack()">
              <z-icon zType="arrow-left"></z-icon>
            </z-button>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Tasks -->
          <z-card class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Tasks</p>
                <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ totalCount() }}</p>
              </div>
              <z-icon zType="list-filter-plus" class="text-3xl text-blue-500"></z-icon>
            </div>
          </z-card>

          <!-- Active Tasks -->
          <z-card class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Active Tasks</p>
                <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ activeCount() }}</p>
              </div>
              <z-icon zType="clock" class="text-3xl text-yellow-500"></z-icon>
            </div>
          </z-card>

          <!-- Completed Tasks -->
          <z-card class="p-6">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Completed Tasks</p>
                <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ completedCount() }}</p>
              </div>
              <z-icon zType="circle-check" class="text-3xl text-green-500"></z-icon>
            </div>
          </z-card>
        </div>

        <!-- Completion Rate -->
        <z-card class="p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Completion Rate</h2>
          <div class="flex items-end gap-6">
            <div class="flex-1">
              <div class="relative h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  [style.width.%]="completionRate()"
                ></div>
              </div>
              <div class="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p class="text-gray-600 dark:text-gray-400">Progress</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ completionRate() }}%</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">Remaining</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ 100 - completionRate() }}%</p>
                </div>
                <div>
                  <p class="text-gray-600 dark:text-gray-400">Tasks Left</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeCount() }}</p>
                </div>
              </div>
            </div>
          </div>
        </z-card>

        <!-- Category Breakdown -->
        <z-card class="p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">By Category</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (category of categoryStats(); track category.name) {
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-900 dark:text-white capitalize">{{ category.name }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ category.completed }}/{{ category.total }}</span>
                </div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-blue-500 transition-all duration-300"
                    [style.width.%]="category.total > 0 ? (category.completed / category.total) * 100 : 0"
                  ></div>
                </div>
              </div>
            }
          </div>
          @if (categoryStats().length === 0) {
            <p class="text-center text-gray-500 dark:text-gray-400 py-8">No tasks yet. Start by creating your first task!</p>
          }
        </z-card>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AnalyticsComponent {
  private router = inject(Router);
  private todoService = inject(TodoService);

  totalCount = computed(() => this.todoService.getTodos().length);
  completedCount = computed(() => this.todoService.getCompletedCount());
  activeCount = computed(() => this.todoService.getActiveCount());
  completionRate = computed(() => {
    const total = this.totalCount();
    const completed = this.completedCount();
    return total ? Math.round((completed / total) * 100) : 0;
  });

  categoryStats = computed(() => {
    const todos = this.todoService.getTodos();
    const categoryMap = new Map<string, { total: number; completed: number }>();

    todos.forEach(todo => {
      todo.category.forEach(cat => {
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, { total: 0, completed: 0 });
        }
        const stats = categoryMap.get(cat)!;
        stats.total++;
        if (todo.completed) {
          stats.completed++;
        }
      });
    });

    return Array.from(categoryMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  goBack() {
    this.router.navigate(['/todos']);
  }
}

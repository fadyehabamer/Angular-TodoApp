import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardIconComponent } from '@/shared/components/icon';
import { ZardCardComponent } from '@/shared/components/card';

@Component({
  selector: 'app-landing',
  imports: [RouterModule, ZardButtonComponent, ZardIconComponent, ZardCardComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <!-- Header -->
      <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">TodoApp</h1>
          <div class="flex gap-2">
            <a z-button zType="outline" routerLink="/todos">
              <z-icon zType="list-filter-plus" class="mr-2"></z-icon>
              My Todos
            </a>
            <a z-button zType="default" routerLink="/add">
              <z-icon zType="plus" class="mr-2"></z-icon>
              New Todo
            </a>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Stay Organized & Productive</h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Manage your tasks effortlessly with our modern todo app. Organize by categories, set priorities, track progress, and achieve your goals.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a z-button zType="default" class="px-8 py-4 text-lg" routerLink="/todos">
            <z-icon zType="arrow-right" class="mr-2"></z-icon>
            Explore
          </a>
          <a z-button zType="outline" class="px-8 py-4 text-lg" routerLink="/add">
            <z-icon zType="plus" class="mr-2"></z-icon>
            Create First Todo
          </a>
        </div>
      </section>

      <!-- Features Section -->
      <section class="max-w-6xl mx-auto px-4 py-16">
        <h3 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Features</h3>
        <div class="grid md:grid-cols-3 gap-6">
          <z-card class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <z-icon zType="tag" class="text-blue-600 text-2xl"></z-icon>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Categories</h4>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Organize todos by work, personal, shopping, health, and more.</p>
          </z-card>

          <z-card class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <z-icon zType="zap" class="text-orange-600 text-2xl"></z-icon>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Priorities</h4>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Set low, medium, or high priority levels for each task.</p>
          </z-card>

          <z-card class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <z-icon zType="calendar" class="text-green-600 text-2xl"></z-icon>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Due Dates</h4>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Set optional due dates to track deadlines effectively.</p>
          </z-card>

          <z-card class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <z-icon zType="circle-check" class="text-green-500 text-2xl"></z-icon>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Track Progress</h4>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Monitor completion rates and task statistics in real-time.</p>
          </z-card>

          <z-card class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <z-icon zType="moon" class="text-purple-600 text-2xl"></z-icon>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Dark Mode</h4>
            </div>
            <p class="text-gray-600 dark:text-gray-400">Switch between light and dark themes for comfortable viewing.</p>
          </z-card>

          <z-card class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <z-icon zType="save" class="text-blue-600 text-2xl"></z-icon>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Auto-Save</h4>
            </div>
            <p class="text-gray-600 dark:text-gray-400">All your todos are automatically saved to local storage.</p>
          </z-card>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="max-w-6xl mx-auto px-4 py-16 text-center">
        <z-card class="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h3 class="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p class="text-lg mb-8 opacity-90">Create your first todo and start organizing your life today.</p>
          <a z-button zType="default" class="px-8 py-3" routerLink="/add">
            <z-icon zType="plus" class="mr-2"></z-icon>
            Create Your First Todo
          </a>
        </z-card>
      </section>

      <!-- Footer -->
      <footer class="max-w-6xl mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
        <p>© 2025 TodoApp. Built with Angular & Zard UI.</p>
      </footer>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class LandingComponent {}

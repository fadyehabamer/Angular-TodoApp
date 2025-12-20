import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'todos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'add',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'analytics',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'edit/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return empty array since we can't know all todo IDs at build time
      return [];
    }
  }
];

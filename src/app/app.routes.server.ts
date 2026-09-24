import { RenderMode, ServerRoute } from '@angular/ssr';

// Todos live in the browser's localStorage, so pages that display them can't
// be rendered meaningfully on the server: prerendering them bakes in an empty
// list, and /edit/:id would always hit the "Todo not found" path. Render
// those pages on the client only.
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'add',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'todos',
    renderMode: RenderMode.Client
  },
  {
    path: 'analytics',
    renderMode: RenderMode.Client
  },
  {
    path: 'edit/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];

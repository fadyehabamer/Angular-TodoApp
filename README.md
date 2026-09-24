# TodoApp

A todo app built with Angular 21 (standalone components and signals), Tailwind CSS and
[Zard UI](https://zardui.com) components, with server-side rendering via `@angular/ssr`.

## Features

- Create, edit, complete and delete todos, with undo after deleting
- Categories (multi-select), low/medium/high priority and an optional due date
- Filter by status (all / active / completed) and search by text
- Analytics page with completion rate and per-category progress
- Light/dark theme that follows your system preference by default
- Keyboard shortcuts on the todo list: <kbd>Ctrl/Cmd</kbd> + <kbd>Alt</kbd> + <kbd>N</kbd>
  for a new todo, <kbd>Ctrl/Cmd</kbd> + <kbd>F</kbd> to focus search
- Todos and the theme are saved in your browser's `localStorage`; there is no backend or account

## Routes

| Path        | Page                     | Rendering   |
| ----------- | ------------------------ | ----------- |
| `/`         | Landing page             | Prerendered |
| `/todos`    | Todo list                | Client      |
| `/add`      | Add a todo               | Prerendered |
| `/edit/:id` | Edit a todo              | Client      |
| `/analytics` | Statistics             | Client      |

Pages that show todos render in the browser only, because the data lives in `localStorage`.
Unknown paths redirect to `/`.

## Getting started

Requires Node.js `^20.19.0 || ^22.12.0 || >=24.0.0` (Angular 21 requirement).

```bash
npm install
npm start          # ng serve on http://localhost:4200/
```

## Scripts

| Command                     | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `npm start`                 | Development server with live reload                      |
| `npm run build`             | Production build (browser + server bundles) in `dist/`   |
| `npm test`                  | Unit tests with Vitest in jsdom (no browser needed)      |
| `npm run serve:ssr:todo-app`| Serve the production build with the Node SSR server      |

Use `npm test -- --watch=false` for a single run, for example in CI.

## Deploying the SSR server

```bash
npm run build
PORT=4000 npm run serve:ssr:todo-app
```

Angular's SSR server only accepts requests whose `Host` header is allowed (protection against
server-side request forgery). `localhost` is allowed in `angular.json`
(`security.allowedHosts`). For a real domain, add it there or set the `NG_ALLOWED_HOSTS`
environment variable to a comma-separated list, e.g. `NG_ALLOWED_HOSTS=todo.example.com`.

## License

[MIT](LICENSE)

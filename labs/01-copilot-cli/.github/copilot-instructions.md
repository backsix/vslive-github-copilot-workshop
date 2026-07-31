# Copilot instructions for this repository

Purpose: Provide repository-scoped guidance for Copilot CLI/agents so future sessions understand how to build, run, and modify code here.

---

## Build, test, and lint commands
- Dev (local, live-reload):
  - npm run dev
  - Opens the Astro dev server (default: http://localhost:3000)
- Build (production):
  - npm run build
  - Note: project is configured as a server output (see astro.config.mjs). Building produces server output (dist/).
- Preview (serve production build locally):
  - npm run preview

Notes:
- No test runner or linter is configured in package.json. There are no npm scripts for `test` or `lint` in this repo.
- To exercise a single dynamic route (API): start dev and curl the endpoint, e.g.: `curl http://localhost:3000/api/contributions/<username>` — the current implementation returns 501 (stub).

---

## High-level architecture (big picture)
- Framework: Astro v6 with the @astrojs/node adapter.
- Runtime & deployment model:
  - astro.config.mjs sets `output: 'server'` and uses the Node adapter in standalone mode — app runs server-side (SSR) and exposes API routes.
- Routing & structure:
  - Pages and routes live under `src/pages/`. Files map directly to routes (including dynamic routes like `src/pages/api/contributions/[username].ts`).
  - API endpoints are implemented as Astro APIRoute handlers (TypeScript files exporting HTTP methods such as `GET`).
  - Static assets and simple public files are in `public/` and served from root.
- Workshop / documentation:
  - README contains workshop links and docs are expected under `workshop/` and `docs/` (these are content, not part of runtime code).

---

## Key conventions and repository-specific patterns
- ESM module mode: package.json contains `"type": "module"` — use ESM imports/exports in server code.
- API routes use `export const prerender = false;` for dynamic endpoints that should not be prerendered.
- TypeScript in routes: API handlers are `.ts` files exporting Astro `APIRoute` handlers. Keep route handlers small and testable.
- Minimal package.json: only `astro` and `@astrojs/node` are listed. Adding tools (tests/lint/format) should update package.json scripts and CI accordingly.
- Deployment note (repo-specific): default build is server output. If converting to a static GitHub Pages deployment, update `astro.config.mjs` (set `output: 'static'`) and remove the Node adapter. README.md documents these steps.

---

## Files and places to check for context
- astro.config.mjs — deployment output & adapter (server vs static)
- package.json — scripts and dependencies
- src/pages/ — routing and API handlers (dynamic routes live here)
- public/ — static assets and icons
- README.md — workshop overview and deployment guidance

---

## Existing AI/assistant files
- No CLAUDE.md, AGENTS.md, .cursorrules, .windsurfrules, or other AI-assistant config files were found. If adding one, place it at repository root or under `.github/` and reference it here.

---

If you'd like, configure MCP servers relevant to this project (for example: Playwright for browser testing or a Vite/Playwright runner for end-to-end checks). Would you like to configure any MCP servers now? (e.g., Playwright)

---

Summary: created repository-scoped Copilot instructions that document how to build and run the project, the high-level architecture, and the repository-specific conventions. Ask if adjustments or additional coverage (tests, linting, CI integration, MCP servers) are desired.
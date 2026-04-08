# Frontend Workspace

## Current Layout

- `prototype/web` — the current static HTML/CSS/JS prototype used as a UI reference
- `app` — production Next.js App Router application
- `components` — reusable UI building blocks
- `features` — page-level content and domain-specific frontend modules
- `lib` — API client, config, and shared frontend types

## Intended Next Step

The production frontend should be implemented in this workspace separately from the prototype so we can:

- preserve the existing reference UI;
- migrate pages gradually into application screens;
- avoid mixing static experiments with production code.

# Repository Structure

## Main Folders

- `frontend/` — client-side workspace
- `backend/` — server-side workspace
- `database/` — SQL migrations and seed data
- `content/` — curriculum and educational materials
- `docs/` — product, architecture, and implementation documentation
- `archive/legacy/` — archived experiments and non-production leftovers
- `practices/` — separate educational or coursework materials not used by the product runtime

## Frontend

- `frontend/prototype/web/` — static prototype preserved as a design and content reference

## Backend

- `backend/api/` — FastAPI application, configuration, models, schemas, and routes

## Database

- `database/migrations/` — initial and future schema migrations
- `database/seeds/` — catalog and starter learning content

## Content

- `content/curriculum/` — learning tracks, level overviews, and curriculum organization notes

## Why This Split

This layout keeps:

- product runtime code separate from experiments;
- API code separate from database assets;
- educational content separate from technical documentation;
- frontend work separate from the static prototype;
- legacy leftovers outside the active development path.

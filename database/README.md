# Database Workspace

## Current Layout

- `migrations` — SQL schema migrations
- `seeds` — initial reference data for local development and demos

## Seed Files

- `001_tracks.sql` — базовый каталог треков
- `002_cpp_starter_content.sql` — первый стартовый C++ урок для MVP
- `003_full_curriculum.sql` — расширенный каталог учебных материалов по всем активным трекам

## Notes

This folder is intentionally separated from the API service so schema changes, seed data, and operational database tasks remain easy to review and version independently.

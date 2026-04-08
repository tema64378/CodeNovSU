# CodeNovsu API

This folder contains the production backend API service.

## Main Files

- `app/main.py` — FastAPI application entry point
- `app/api/` — route registration and endpoints
- `app/models/` — SQLAlchemy domain models
- `app/schemas/` — request and response schemas
- `app/core/` — configuration and security helpers
- `app/db/` — database base classes and session management
- `scripts/` — local bootstrap and operational helper scripts
- `.env.example` — local environment template
- `pyproject.toml` — Python dependencies and project metadata

## Bootstrap

Когда локальная PostgreSQL поднята, можно применить схему и учебные материалы одной командой:

```bash
cd /Users/akovlevartem/Documents/codebot/backend/api
.venv/bin/python -m scripts.bootstrap_learning_content --mode all
```

Допустимые режимы:

- `--mode schema` — только миграции
- `--mode seeds` — только seed-данные
- `--mode all` — миграции и все seed-файлы

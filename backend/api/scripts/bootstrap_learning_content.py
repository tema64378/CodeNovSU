from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

from sqlalchemy import create_engine

from app.core.config import settings


ROOT_DIR = Path(__file__).resolve().parents[2]
DATABASE_DIR = ROOT_DIR / "database"
MIGRATIONS_DIR = DATABASE_DIR / "migrations"
SEEDS_DIR = DATABASE_DIR / "seeds"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Apply CodeNovsu schema and curriculum seed files to PostgreSQL.",
    )
    parser.add_argument(
        "--mode",
        choices=("all", "schema", "seeds"),
        default="all",
        help="Choose whether to apply migrations, seeds, or both.",
    )
    parser.add_argument(
        "--database-url",
        default=settings.database_url,
        help="SQLAlchemy-compatible PostgreSQL URL. Defaults to DATABASE_URL from config.",
    )
    return parser.parse_args()


def iter_sql_files(mode: str) -> Iterable[Path]:
    if mode in {"all", "schema"}:
        yield from sorted(MIGRATIONS_DIR.glob("*.sql"))
    if mode in {"all", "seeds"}:
        yield from sorted(SEEDS_DIR.glob("*.sql"))


def apply_sql_files(database_url: str, files: Iterable[Path]) -> None:
    engine = create_engine(database_url, pool_pre_ping=True)
    connection = engine.raw_connection()

    try:
        with connection.cursor() as cursor:
            for sql_file in files:
                sql = sql_file.read_text(encoding="utf-8")
                print(f"Applying {sql_file.relative_to(ROOT_DIR)}")
                cursor.execute(sql)
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
        engine.dispose()


def main() -> None:
    args = parse_args()
    sql_files = list(iter_sql_files(args.mode))
    if not sql_files:
        print("No SQL files found for the selected mode.")
        return

    apply_sql_files(args.database_url, sql_files)
    print(f"Done. Applied {len(sql_files)} SQL file(s).")


if __name__ == "__main__":
    main()

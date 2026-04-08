from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError


async def database_unavailable_handler(_: Request, __: OperationalError) -> JSONResponse:
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Database is unavailable. Start PostgreSQL and apply migrations before using data endpoints.",
        },
    )

import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv


# Find the .env file in the backend directory
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def get_connection():
    password = os.getenv("DB_PASSWORD")

    if not password:
        raise RuntimeError(
            "DB_PASSWORD is missing. Configure it in backend/.env."
        )

    return psycopg.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        dbname=os.getenv("DB_NAME", "supplychain_ai"),
        user=os.getenv("DB_USER", "postgres"),
        password=password,
        connect_timeout=5,
    )
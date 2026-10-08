import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# Load the .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")


# Create the PostgreSQL connection
engine = create_engine(DATABASE_URL)


# Base class for database models
Base = declarative_base()


# Create database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_database():
    """
    Create a database session for an API request.
    """
    database = SessionLocal()

    try:
        yield database
    finally:
        database.close()
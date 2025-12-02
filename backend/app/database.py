# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .config import settings
from .models import Base

# Use value from env instead of hard-coded string
DATABASE_URL = settings.database_url

engine = create_engine(DATABASE_URL, echo=True)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """Yield a SQLAlchemy session (we'll use this in routes later)."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Create tables based on SQLAlchemy models.
    """
    # Import models to ensure they are registered with Base
    from . import models
    # Create all tables
    Base.metadata.create_all(bind=engine)

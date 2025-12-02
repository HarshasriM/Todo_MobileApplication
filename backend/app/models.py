# app/models.py
from __future__ import annotations

from datetime import datetime
from typing import Optional, List

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Mapped
from pydantic import BaseModel


# SQLAlchemy Base
Base = declarative_base()


# ---------- SQLAlchemy DATABASE MODELS ----------

class User(Base):
    __tablename__ = "user"
    
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    email: Mapped[str] = Column(String, unique=True, index=True, nullable=False)
    full_name: Mapped[Optional[str]] = Column(String, nullable=True)
    hashed_password: Mapped[str] = Column(String, nullable=False)
    
    # One-to-many: one user has many todos
    todos: Mapped[List["Todo"]] = relationship("Todo", back_populates="owner")


class Todo(Base):
    __tablename__ = "todo"
    
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    title: Mapped[str] = Column(String, nullable=False)
    is_completed: Mapped[bool] = Column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = Column(DateTime, default=datetime.utcnow, nullable=False)
    owner_id: Mapped[int] = Column(Integer, ForeignKey("user.id"), nullable=False)
    
    # Many-to-one: many todos belong to one user
    owner: Mapped["User"] = relationship("User", back_populates="todos")


# ---------- PYDANTIC MODELS (for API requests/responses) ----------

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    
    class Config:
        from_attributes = True


class TodoBase(BaseModel):
    title: str
    is_completed: bool = False
    created_at: Optional[datetime] = None

class TodoCreate(TodoBase):
    pass


class TodoRead(TodoBase):
    id: int
    owner_id: int
    
    class Config:
        from_attributes = True


class TodoUpdate(BaseModel):
    title: Optional[str] = None

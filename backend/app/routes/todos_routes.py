# app/routers/todo_routes.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_session
from app.models import Todo, TodoRead, TodoCreate, TodoUpdate, User
from app.utils.dependency import get_current_user

router = APIRouter(prefix="/todos", tags=["Todos"])


@router.get("/", response_model=List[TodoRead])
def get_todos(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get all todos for the current user."""
    todos = session.query(Todo).filter(
        Todo.owner_id == current_user.id
    ).order_by(Todo.created_at.desc()).all()
    
    # Convert SQLAlchemy models to Pydantic models
    return [TodoRead.model_validate(todo) for todo in todos]


@router.post("/create", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo_in: TodoCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new todo for the current user."""
    todo = Todo(
        title=todo_in.title,
        owner_id=current_user.id,
    )
    session.add(todo)
    session.commit()
    session.refresh(todo)
    
    # Convert SQLAlchemy model to Pydantic model
    return TodoRead.model_validate(todo)


@router.patch("/{todo_id}/complete", response_model=TodoRead)
def mark_todo_complete(
    todo_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Mark a todo as completed."""
    # Find todo by ID and owner
    todo = session.query(Todo).filter(
        Todo.id == todo_id,
        Todo.owner_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if todo.is_completed:
        # Already completed, return current state
        return TodoRead.model_validate(todo)

    # Update todo to completed
    todo.is_completed = True
    session.add(todo)
    session.commit()
    session.refresh(todo)
    
    # Convert SQLAlchemy model to Pydantic model
    return TodoRead.model_validate(todo)


@router.patch("/{todo_id}/edit", response_model=TodoRead)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Update a todo's title or completion status."""
    # Find todo by ID and owner
    todo = session.query(Todo).filter(
        Todo.id == todo_id,
        Todo.owner_id == current_user.id
    ).first()
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # Update fields if provided
    if todo_update.title is not None:
        todo.title = todo_update.title
    
    session.add(todo)
    session.commit()
    session.refresh(todo)
    
    # Convert SQLAlchemy model to Pydantic model
    return TodoRead.model_validate(todo)

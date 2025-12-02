# app/routers/user_routes.py
from fastapi import APIRouter, Depends

from app.models import User, UserRead
from app.utils.dependency import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    # Convert SQLAlchemy model to Pydantic model for proper serialization
    return UserRead.model_validate(current_user)

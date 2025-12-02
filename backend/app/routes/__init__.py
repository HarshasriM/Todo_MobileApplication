# app/routers/__init__.py
from . import auth_routes, todos_routes, user_routes  # noqa: F401
__all__ = ["auth_routes", "todos_routes", "user_routes"]
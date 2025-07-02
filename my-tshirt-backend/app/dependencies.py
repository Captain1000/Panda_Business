from app.core.security import get_current_user, get_current_admin_user

# Just re-exporting the auth dependencies for convenient import in routes
__all__ = ["get_current_user", "get_current_admin_user"]

# app/auth.py
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
import bcrypt

from app.config import settings
from app.schemas import TokenData




def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using bcrypt directly."""
    # Convert string password to bytes
    password_bytes = plain_password.encode('utf-8')
    # Convert hash string to bytes  
    hash_bytes = hashed_password.encode('utf-8')
    # Use bcrypt to verify
    return bcrypt.checkpw(password_bytes, hash_bytes)


def get_password_hash(password: str) -> str:
    """Generate password hash using bcrypt directly."""
    # Convert password to bytes
    password_bytes = password.encode('utf-8')
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hash_bytes = bcrypt.hashpw(password_bytes, salt)
    # Return hash as string
    return hash_bytes.decode('utf-8')


def create_access_token(data: dict, expires_minutes: Optional[int] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=expires_minutes or settings.access_token_expire_minutes
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.algorithm])
        sub = payload.get("sub")
        if sub is None:
            return None
        return TokenData(user_id=int(sub))
    except (JWTError, ValueError, TypeError):
        return None

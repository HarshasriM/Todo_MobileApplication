# app/config.py
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load variables from .env file into environment
load_dotenv()


class Settings(BaseSettings):
    database_url: str
    jwt_secret_key: str
    access_token_expire_minutes: int = 1440
    algorithm: str
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        fields = {
            "database_url": {"env": "DATABASE_URL"},
            "jwt_secret_key": {"env": "JWT_SECRET_KEY"},
            "access_token_expire_minutes": {"env": "ACCESS_TOKEN_EXPIRE_MINUTES"},
            "algorithm": {"env": "ALGORITHM"},
        }


settings = Settings()

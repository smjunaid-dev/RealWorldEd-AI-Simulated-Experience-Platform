from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "RealWorldEd"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./realworlded.db"
    
    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    
    # Google Gemini Settings
    GEMINI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

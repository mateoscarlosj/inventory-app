from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 30
    debug: bool = False
    algorithm: str = "HS256"
    allow_origin: str = "*"
    

    model_config = SettingsConfigDict(
		env_file=".env",
		extra="allow",
	)

settings = Settings()
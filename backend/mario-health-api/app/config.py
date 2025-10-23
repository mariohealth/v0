import os
from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env in local dev

class Settings:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    # API_KEY = os.getenv("API_KEY", "")  # Optional

settings = Settings()

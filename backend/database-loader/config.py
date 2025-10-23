import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("SUPABASE_DB_USER")
DB_PASS = os.getenv("SUPABASE_DB_PASS")
DB_HOST = os.getenv("SUPABASE_URL")
DB_NAME = os.getenv("SUPABASE_DB_NAME")
DB_PORT = os.getenv("SUPABASE_DB_PORT", 5432)

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

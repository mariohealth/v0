import os
from dotenv import load_dotenv

load_dotenv()

DB_PASS = os.getenv("SUPABASE_DB_PASS")

# DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

DATABASE_URL=f"postgresql://postgres:{DB_PASS}@db.anvremdouphhucqrxgoq.supabase.co:5432/postgres"
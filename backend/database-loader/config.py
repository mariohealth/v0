import os
from dotenv import load_dotenv

load_dotenv()

DB_PASS = os.getenv("SUPABASE_DB_PASS")

#IPv4 compatible
DATABASE_URL = f"postgresql+psycopg2://postgres.anvremdouphhucqrxgoq:{DB_PASS}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# for IPv6
# DATABASE_URL=f"postgresql://postgres:{DB_PASS}@db.anvremdouphhucqrxgoq.supabase.co:5432/postgres"

import os
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool
from config import DATABASE_URL

def test_connection(engine):
    """Verify the DB connection before loading."""
    try:
        with engine.connect() as conn:
            query = text("SELECT 1")
            conn.execute(query)
        print("✅ Database connection OK")
    except Exception as e:
        raise RuntimeError(f"❌ DB connection failed: {e}")

def load_csv_to_db(engine, csv_path, table_name, if_exists="append"):
    """Load a CSV file into a Postgres table."""
    print(f"📥 Loading {csv_path} → table '{table_name}'")
    df = pd.read_csv(csv_path)
    df.to_sql(table_name, engine, if_exists=if_exists, index=False)
    print(f"✅ Loaded {len(df)} rows into '{table_name}'")

def main():
    # Add SSL required for Supabase
    engine = create_engine(
        DATABASE_URL,
        poolclass=NullPool,
        connect_args={"sslmode": "require"}
    )

    test_connection(engine)

    data_dir = "data"
    csv_files = [f for f in os.listdir(data_dir) if f.endswith(".csv")]

    for file in csv_files:
        table_name = os.path.splitext(file)[0]
        load_csv_to_db(engine, os.path.join(data_dir, file), table_name)

    print("\n🎉 All CSV files loaded successfully!")

if __name__ == "__main__":
    main()

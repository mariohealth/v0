import os
import pandas as pd
from sqlalchemy import create_engine
from config import DATABASE_URL

def load_csv_to_db(csv_path, table_name, if_exists="replace"):
    """Load a CSV file into the Supabase Postgres database."""
    print(f"Loading {csv_path} → {table_name}")
    df = pd.read_csv(csv_path)
    engine = create_engine(DATABASE_URL)
    df.to_sql(table_name, engine, if_exists=if_exists, index=False)
    print(f"✅ Loaded {len(df)} rows into '{table_name}'")

def main():
    data_dir = "data"
    csv_files = [f for f in os.listdir(data_dir) if f.endswith(".csv")]

    for file in csv_files:
        table_name = os.path.splitext(file)[0]
        csv_path = os.path.join(data_dir, file)
        load_csv_to_db(csv_path, table_name)

if __name__ == "__main__":
    main()

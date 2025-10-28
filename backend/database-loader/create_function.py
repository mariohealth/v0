import os
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool
from config import DATABASE_URL

def execute_sql_file(engine, filepath):
    with engine.connect() as conn:
        with open(filepath, "r") as file:
            sql = text(file.read())
            conn.execute(sql)
        conn.commit()
        print(f"✅ Executed {filepath}")

def main():
    engine = create_engine(
        DATABASE_URL,
        poolclass=NullPool,
        connect_args={"sslmode": "require"},
    )

    function_dir = "function"
    sql_files = [f for f in os.listdir(function_dir) if f.endswith(".sql")]

    print("📐 Creating function...")
    for f in sql_files:
        execute_sql_file(engine, os.path.join(function_dir, f))

    print("\n🎯 Function creation complete!")

if __name__ == "__main__":
    main()

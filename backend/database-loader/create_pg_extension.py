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

    extension_dir = "extension"
    sql_files = [f for f in os.listdir(extension_dir) if f.endswith(".sql")]

    print("📐 Creating extension...")
    for f in sql_files:
        execute_sql_file(engine, os.path.join(extension_dir, f))

    print("\n🎯 Extension creation complete!")

if __name__ == "__main__":
    main()

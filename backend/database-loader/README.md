# CSV → Database Loader

A simple Python tool to upload local CSV files into our Postgres database.

## Setup

```
cd database-loader
python3 -m venv venv (if not already done)
source venv/bin/activate
pip install -r requirements.txt (if not already done)
```

## Run
```
python3 create_schema.py
python3 load_csvs.py
python3 create_function.py
```

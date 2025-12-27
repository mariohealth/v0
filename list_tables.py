import requests
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def list_tables():
    # Use the PostgREST OpenAPI endpoint to list tables
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}"
    }
    response = requests.get(f"{URL}/rest/v1/", headers=headers)
    if response.status_code == 200:
        data = response.json()
        print("--- DATABASE TABLES ---")
        paths = data.get('paths', {})
        tables = set()
        for path in paths:
            if path == "/": continue
            table = path.split('/')[1]
            tables.add(table)
        
        for t in sorted(list(tables)):
            print(f"  - {t}")
    else:
        print(f"Error fetching table list: {response.status_code}")

if __name__ == "__main__":
    asyncio.run(list_tables())

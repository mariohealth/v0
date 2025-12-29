from supabase import create_client
import os
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def check():
    supabase = create_client(URL, KEY)
    
    ids = ['nyc_003', 'nyc_005', 'nyc_006']
    
    print(f"--- Checking IDs in hospitals table ---")
    try:
        result = supabase.table("hospitals").select("hospital_id, hospital_name").in_("hospital_id", ids).execute()
        print(f"Found {len(result.data)} records in hospitals:")
        for r in result.data:
            print(f"ID: {r.get('hospital_id')}, Name: {r.get('hospital_name')}")
    except Exception as e:
        print(f"Error querying hospitals table: {e}")

if __name__ == "__main__":
    asyncio.run(check())

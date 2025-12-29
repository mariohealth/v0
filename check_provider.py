from supabase import create_client
import os
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def check():
    supabase = create_client(URL, KEY)
    
    ids = ['nyc_003', 'nyc_005', 'nyc_006']
    
    print(f"--- Checking IDs in provider table ---")
    try:
        # Check if they are IDs in the provider table (sometimes org_id is used as provider_id for facilities)
        result = supabase.table("provider").select("id, name").in_("id", ids).execute()
        print(f"Found {len(result.data)} records in provider:")
        for r in result.data:
            print(f"ID: {r.get('id')}, Name: {r.get('name')}")
    except Exception as e:
        print(f"Error querying provider table: {e}")

if __name__ == "__main__":
    asyncio.run(check())

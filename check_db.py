from supabase import create_client
import os
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def check():
    supabase = create_client(URL, KEY)
    
    ids = ['sf_011', 'nyc_003', 'nyc_005', 'nyc_006']
    
    print(f"--- Checking IDs in provider_location ---")
    result = supabase.table("provider_location").select("org_id, org_name, city, state").in_("org_id", ids).execute()
    
    found_ids = [r['org_id'] for r in result.data]
    print(f"Found {len(result.data)} records:")
    for r in result.data:
        print(f"ID: {r['org_id']}, Name: {r['org_name']}, City: {r['city']}")
    
    missing = set(ids) - set(found_ids)
    if missing:
        print(f"\nCRITICAL: Missing IDs in provider_location: {missing}")
    else:
        print(f"\nAll IDs found in provider_location.")

if __name__ == "__main__":
    asyncio.run(check())

from supabase import create_client
import os
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def check():
    supabase = create_client(URL, KEY)
    
    ids = ['nyc_003', 'nyc_005', 'nyc_006']
    
    print(f"--- Checking IDs in procedure_pricing table ---")
    try:
        # Check provider_name associated with these org_ids
        result = supabase.table("procedure_pricing").select("org_id, provider_name").in_("org_id", ids).limit(10).execute()
        print(f"Found {len(result.data)} records in pricing:")
        for r in result.data:
            print(f"Org ID: {r.get('org_id')}, Provider Name: {r.get('provider_name')}")
    except Exception as e:
        print(f"Error querying pricing table: {e}")

if __name__ == "__main__":
    asyncio.run(check())

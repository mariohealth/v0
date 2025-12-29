from supabase import create_client
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def check_hospitals():
    supabase = create_client(URL, KEY)
    
    # 1) Check 'hospitals' table
    print("--- CHECKING 'hospitals' TABLE ---")
    ids = ['nyc_006', 'nyc_003', 'nyc_005', 'sf_006', 'sf_002', 'nyc_002']
    try:
        h_res = supabase.table("hospitals").select("*").in_("hospital_id", ids).execute()
        if h_res.data:
            print(f"Found {len(h_res.data)} records.")
            for r in h_res.data:
                print(f"  ID: {r.get('hospital_id')} | Name: {r.get('hospital_name')} | Status: {r.get('operational_status')}")
        else:
            print("No records found in 'hospitals' table for these IDs.")
    except Exception as e:
        print(f"Error querying 'hospitals': {e}")

    # 2) Check 'procedure_org_pricing' schema/columns
    print("\n--- CHECKING 'procedure_org_pricing' COLUMNS ---")
    try:
        # Just select one row to see all keys
        p_res = supabase.table("procedure_org_pricing").select("*").limit(1).execute()
        if p_res.data:
            print(f"Available columns: {list(p_res.data[0].keys())}")
        else:
            print("No data in 'procedure_org_pricing'.")
    except Exception as e:
        print(f"Error querying 'procedure_org_pricing': {e}")

if __name__ == "__main__":
    asyncio.run(check_hospitals())

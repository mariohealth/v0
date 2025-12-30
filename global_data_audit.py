from supabase import create_client
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def global_audit():
    supabase = create_client(URL, KEY)
    
    print("--- GLOBAL DATA AUDIT: procedure_org_pricing ---\n")
    
    # Get total count and missing count
    try:
        data = supabase.table("procedure_org_pricing").select("org_id, org_name").execute()
        total = len(data.data)
        missing = [r for r in data.data if not r.get('org_name') or r.get('org_name').strip() == ""]
        
        print(f"Total rows: {total}")
        print(f"Rows with NULL/Empty org_name: {len(missing)}")
        if total > 0:
            print(f"Percentage missing: {(len(missing)/total*100):.2f}%")
            
        if missing:
            print("\nSample IDs with missing names:")
            sample_ids = sorted(list(set([r['org_id'] for r in missing[:20]])))
            print(f"  {sample_ids}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(global_audit())

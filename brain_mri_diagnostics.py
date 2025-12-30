from supabase import create_client
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def audit():
    supabase = create_client(URL, KEY)
    
    print("--- DATA DIAGNOSTIC: BRAIN MRI NAME INSPECTION ---\n")
    
    # Get the procedure id for 'brain-mri' slug
    proc_data = supabase.table("procedure").select("id, name, slug").eq("slug", "brain-mri").execute()
    if not proc_data.data:
        print("Error: Could not find procedure with slug 'brain-mri'")
        return
    
    proc = proc_data.data[0]
    proc_id = proc['id']
    
    # Query procedure_org_pricing for this procedure
    pricing_data = supabase.table("procedure_org_pricing").select("org_id, org_name").eq("procedure_id", proc_id).execute()
    
    print(f"Total rows for Brain MRI: {len(pricing_data.data)}\n")
    
    print("Row data (org_id | org_name):")
    for r in pricing_data.data:
        print(f"  {r['org_id']} | {r['org_name']}")

if __name__ == "__main__":
    asyncio.run(audit())

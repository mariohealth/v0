from supabase import create_client
import json

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

def verify():
    supabase = create_client(URL, KEY)
    
    # Get brain-mri ID
    proc = supabase.table("procedure").select("id").eq("slug", "brain-mri").execute()
    proc_id = proc.data[0]['id']
    
    # Query procedure_org_pricing for nyc_006 + brain-mri
    result = supabase.table("procedure_org_pricing").select("*").eq("org_id", "nyc_006").eq("procedure_id", proc_id).execute()
    
    if result.data:
        print(json.dumps(result.data, indent=2))
    else:
        print(f"No data found for nyc_006 and procedure {proc_id}")

if __name__ == "__main__":
    verify()

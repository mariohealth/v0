from supabase import create_client
import json

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

def verify():
    supabase = create_client(URL, KEY)
    
    # Query procedure_org_pricing for nyc_006
    result = supabase.table("procedure_org_pricing").select("*").eq("org_id", "nyc_006").limit(1).execute()
    
    if result.data:
        print(json.dumps(result.data[0], indent=2))
    else:
        print("No data found for nyc_006")

if __name__ == "__main__":
    verify()

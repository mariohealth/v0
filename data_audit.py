from supabase import create_client
import asyncio

URL = "https://anvremdouphhucqrxgoq.supabase.co"
KEY = "sb_secret_i9PViPYVORDdCkb_xmaWgw_n_vOSdfW"

async def audit():
    supabase = create_client(URL, KEY)
    
    print("--- TASK 1: DATABASE DIAGNOSTICS ---\n")
    
    # 1.1 Provider Location Stats
    print("Querying provider_location...")
    pl_data = supabase.table("provider_location").select("org_id, org_name").execute()
    
    all_pl_orgs = [r.get('org_id') for r in pl_data.data if r.get('org_id')]
    named_pl_orgs = [r.get('org_id') for r in pl_data.data if r.get('org_id') and r.get('org_name') and r.get('org_name').strip()]
    
    total_distinct_orgs_in_pl = len(set(all_pl_orgs))
    named_distinct_orgs_in_pl = len(set(named_pl_orgs))
    
    print(f"Total distinct org_ids in provider_location: {total_distinct_orgs_in_pl}")
    print(f"Distinct org_ids with names in provider_location: {named_distinct_orgs_in_pl}")
    print(f"Percentage coverage in provider_location: {(named_distinct_orgs_in_pl/total_distinct_orgs_in_pl*100):.2f}%" if total_distinct_orgs_in_pl else "NA")

    # 1.2 Sample of named orgs
    print("\nSample of orgs that HAVE names:")
    sample = [r for r in pl_data.data if r.get('org_name')][:10]
    for r in sample:
        print(f"  - {r['org_id']}: {r['org_name']}")

    # 1.3 Missing from pricing vs location
    print("\nQuerying procedure_org_pricing...")
    pricing_data = supabase.table("procedure_org_pricing").select("org_id").execute()
    pricing_org_ids = set([r.get('org_id') for r in pricing_data.data if r.get('org_id')])
    
    print(f"Total distinct org_ids in procedure_org_pricing: {len(pricing_org_ids)}")
    
    valid_named_ids = set(named_pl_orgs)
    missing_names = sorted(list(pricing_org_ids - valid_named_ids))
    
    print(f"Total orgs in pricing MISSING human names: {len(missing_names)}")
    print(f"First 10 missing IDs: {missing_names[:10]}")
    
    # Check if they are in pl at all but name is null
    all_pl_ids_set = set(all_pl_orgs)
    missing_completely = pricing_org_ids - all_pl_ids_set
    print(f"Total orgs in pricing NOT AT ALL in provider_location: {len(missing_completely)}")

if __name__ == "__main__":
    asyncio.run(audit())

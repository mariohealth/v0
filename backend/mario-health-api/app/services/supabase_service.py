from supabase import create_client
from app.config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def search_products(query: str):
    result = supabase.table("products") \
        .select("*") \
        .or_(f"name.ilike.%{query}%,description.ilike.%{query}%") \
        .limit(20) \
        .execute()
    return result.data

def list_procedure_categories():
    result = supabase.table("procedure_categories") \
        .select("*") \
        .execute()
    return result.data
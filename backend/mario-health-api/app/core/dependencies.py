from supabase import create_client, Client
from functools import lru_cache
import os
from dotenv import load_dotenv
load_dotenv()


@lru_cache()
def get_supabase_client() -> Client:
    """Create cached Supabase client."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

    return create_client(url, key)


async def get_supabase() -> Client:
    """FastAPI dependency for Supabase client."""
    return get_supabase_client()

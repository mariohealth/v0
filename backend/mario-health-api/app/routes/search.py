from fastapi import APIRouter, Query, HTTPException, Header
from app.services.supabase_service import search_products
from app.config import settings

router = APIRouter()

@router.get("")
async def search(q: str = Query(..., min_length=1), x_api_key: str = Header(None)):
    if settings.API_KEY and x_api_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = search_products(q)
    return {"results": data}

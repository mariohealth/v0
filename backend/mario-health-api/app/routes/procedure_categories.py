from fastapi import APIRouter, HTTPException, Header
from app.services.supabase_service import list_procedure_categories
from app.config import settings

router = APIRouter(prefix="/procedure-categories", tags=["procedure-categories"])

@router.get(summary="List procedure categories")
async def procedure_categories(x_api_key: str = Header(None)):
    if settings.API_KEY and x_api_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = list_procedure_categories()
    return {"results": data}

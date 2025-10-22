from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import search

app = FastAPI(title="Supabase Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(search.router, prefix="/search", tags=["search"])

@app.get("/")
async def root():
    return {"message": "Supabase Search API is running"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import categories, families, procedures

app = FastAPI(
    title="Mario Health API",
    description="The API for Mario Health backend",
    version="0.1",
    contact={
        "name": "Engineering Team",
        "email": "engineers@mario.health",
    },
    license_info={
        "name": "Proprietary – Internal Use Only"
    }
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(categories.router, prefix="/api/v1")
app.include_router(families.router, prefix="/api/v1")
app.include_router(procedures.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Mario Health API is running"}

from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from routes import games, backlog, preferences
from database import close_db_connection

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="GameVault API", description="API for gaming management system")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add health check endpoint
@api_router.get("/")
async def root():
    return {"message": "GameVault API is running", "status": "healthy"}

# Include route modules
api_router.include_router(games.router)
api_router.include_router(backlog.router)
api_router.include_router(preferences.router)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),  # In production, specify exact origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db_connection()

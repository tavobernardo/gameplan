from fastapi import APIRouter, HTTPException
from datetime import datetime
from models import Preferences, PreferencesCreate, PreferencesUpdate
from database import preferences_collection

router = APIRouter(prefix="/preferences", tags=["preferences"])

@router.get("/", response_model=Preferences)
async def get_preferences():
    """Get user preferences"""
    prefs = await preferences_collection.find_one()
    if not prefs:
        # Create default preferences if none exist
        default_prefs = {
            "id": Preferences().id,
            "language": "en",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        await preferences_collection.insert_one(default_prefs)
        return Preferences(**default_prefs)
    
    return Preferences(**prefs)

@router.put("/", response_model=Preferences)
async def update_preferences(prefs_update: PreferencesUpdate):
    """Update user preferences"""
    update_data = {k: v for k, v in prefs_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    update_data["updatedAt"] = datetime.utcnow()
    
    # Get existing preferences or create new ones
    existing_prefs = await preferences_collection.find_one()
    if not existing_prefs:
        new_prefs = {
            "id": Preferences().id,
            "language": update_data.get("language", "en"),
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        await preferences_collection.insert_one(new_prefs)
        return Preferences(**new_prefs)
    
    await preferences_collection.update_one(
        {"id": existing_prefs["id"]}, 
        {"$set": update_data}
    )
    
    updated_prefs = await preferences_collection.find_one({"id": existing_prefs["id"]})
    return Preferences(**updated_prefs)
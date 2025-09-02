from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from models import Backlog, BacklogCreate, BacklogUpdate, Game, MoveToLibraryRequest
from database import backlog_collection, games_collection

router = APIRouter(prefix="/backlog", tags=["backlog"])

@router.get("/", response_model=List[Backlog])
async def get_backlog(
    category: Optional[str] = None,
    priority: Optional[str] = None,
    platform: Optional[str] = None
):
    """Get backlog games with optional filters"""
    query = {}
    
    if category and category != "All":
        query["category"] = category
    if priority and priority != "All":
        query["priority"] = priority
    if platform and platform != "All":
        query["platform"] = platform
    
    backlog_items = await backlog_collection.find(query).to_list(1000)
    return [Backlog(**item) for item in backlog_items]

@router.post("/", response_model=Backlog)
async def create_backlog_item(backlog_item: BacklogCreate):
    """Add a game to backlog"""
    backlog_dict = backlog_item.dict()
    backlog_dict["id"] = Backlog().id
    backlog_dict["createdAt"] = datetime.utcnow()
    backlog_dict["updatedAt"] = datetime.utcnow()
    
    await backlog_collection.insert_one(backlog_dict)
    return Backlog(**backlog_dict)

@router.get("/{backlog_id}", response_model=Backlog)
async def get_backlog_item(backlog_id: str):
    """Get a specific backlog item by ID"""
    item = await backlog_collection.find_one({"id": backlog_id})
    if not item:
        raise HTTPException(status_code=404, detail="Backlog item not found")
    return Backlog(**item)

@router.put("/{backlog_id}", response_model=Backlog)
async def update_backlog_item(backlog_id: str, backlog_update: BacklogUpdate):
    """Update a backlog item"""
    update_data = {k: v for k, v in backlog_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await backlog_collection.update_one(
        {"id": backlog_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Backlog item not found")
    
    updated_item = await backlog_collection.find_one({"id": backlog_id})
    return Backlog(**updated_item)

@router.delete("/{backlog_id}")
async def delete_backlog_item(backlog_id: str):
    """Remove item from backlog"""
    result = await backlog_collection.delete_one({"id": backlog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Backlog item not found")
    return {"message": "Backlog item deleted successfully"}

@router.post("/{backlog_id}/move-to-library", response_model=Game)
async def move_backlog_to_library(backlog_id: str, move_data: MoveToLibraryRequest):
    """Move a backlog item to the main games library"""
    # Get the backlog item
    backlog_item = await backlog_collection.find_one({"id": backlog_id})
    if not backlog_item:
        raise HTTPException(status_code=404, detail="Backlog item not found")
    
    # Create new game from backlog item
    game_dict = {
        "id": Game().id,
        "title": backlog_item["title"],
        "platform": backlog_item["platform"],
        "genre": backlog_item["genre"],
        "status": move_data.status,
        "rating": move_data.rating,
        "playtime": move_data.playtime,
        "developer": backlog_item["developer"],
        "releaseDate": backlog_item["releaseDate"],
        "startDate": move_data.startDate,
        "completionDate": move_data.completionDate,
        "cover": backlog_item["cover"],
        "progress": move_data.progress,
        "notes": move_data.notes or backlog_item.get("notes"),
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    # Insert into games collection
    await games_collection.insert_one(game_dict)
    
    # Remove from backlog
    await backlog_collection.delete_one({"id": backlog_id})
    
    return Game(**game_dict)
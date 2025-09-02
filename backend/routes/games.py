from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from ..models import Game, GameCreate, GameUpdate, StatsResponse
from ..database import games_collection, backlog_collection

router = APIRouter(prefix="/games", tags=["games"])

@router.get("/", response_model=List[Game])
async def get_games(
    platform: Optional[str] = None,
    genre: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all games with optional filters"""
    query = {}
    
    if platform and platform != "All":
        query["platform"] = platform
    if genre and genre != "All":
        query["genre"] = genre
    if status and status != "All":
        query["status"] = status
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"developer": {"$regex": search, "$options": "i"}}
        ]
    
    games = await games_collection.find(query).to_list(1000)
    return [Game(**game) for game in games]

@router.post("/", response_model=Game)
async def create_game(game: GameCreate):
    """Create a new game"""
    game_dict = game.dict()
    game_dict["id"] = Game().id
    game_dict["createdAt"] = datetime.utcnow()
    game_dict["updatedAt"] = datetime.utcnow()
    
    await games_collection.insert_one(game_dict)
    return Game(**game_dict)

@router.get("/{game_id}", response_model=Game)
async def get_game(game_id: str):
    """Get a specific game by ID"""
    game = await games_collection.find_one({"id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return Game(**game)

@router.put("/{game_id}", response_model=Game)
async def update_game(game_id: str, game_update: GameUpdate):
    """Update a game"""
    update_data = {k: v for k, v in game_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await games_collection.update_one(
        {"id": game_id}, 
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    
    updated_game = await games_collection.find_one({"id": game_id})
    return Game(**updated_game)

@router.delete("/{game_id}")
async def delete_game(game_id: str):
    """Delete a game"""
    result = await games_collection.delete_one({"id": game_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"message": "Game deleted successfully"}

@router.get("/stats/dashboard", response_model=StatsResponse)
async def get_dashboard_stats():
    """Get dashboard statistics"""
    games = await games_collection.find().to_list(1000)
    backlog = await backlog_collection.find().to_list(1000)
    
    completed = len([g for g in games if g.get("status") == "Completed"])
    in_progress = len([g for g in games if g.get("status") == "In Progress"])
    total_playtime = sum(g.get("playtime", 0) for g in games)
    avg_rating = sum(g.get("rating", 0) for g in games) / len(games) if games else 0
    
    return StatsResponse(
        totalGames=len(games),
        completed=completed,
        inProgress=in_progress,
        totalPlaytime=total_playtime,
        avgRating=round(avg_rating, 1),
        backlogCount=len(backlog)
    )
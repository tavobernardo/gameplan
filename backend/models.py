from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Game Models
class GameBase(BaseModel):
    title: str
    platform: str
    genre: str
    status: str  # "Completed", "In Progress", "Dropped", "Not Started"
    rating: float
    playtime: int
    developer: str
    releaseDate: str
    startDate: Optional[str] = None
    completionDate: Optional[str] = None
    cover: str
    progress: int = 0  # 0-100
    notes: Optional[str] = None

class GameCreate(GameBase):
    pass

class GameUpdate(BaseModel):
    title: Optional[str] = None
    platform: Optional[str] = None
    genre: Optional[str] = None
    status: Optional[str] = None
    rating: Optional[float] = None
    playtime: Optional[int] = None
    developer: Optional[str] = None
    releaseDate: Optional[str] = None
    startDate: Optional[str] = None
    completionDate: Optional[str] = None
    cover: Optional[str] = None
    progress: Optional[int] = None
    notes: Optional[str] = None

class Game(GameBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Backlog Models
class BacklogBase(BaseModel):
    title: str
    platform: str
    genre: str
    category: str  # "Next to Play", "Maybe Later", "Wishlist"
    priority: str  # "High", "Medium", "Low"
    developer: str
    releaseDate: str
    cover: str
    estimatedPlaytime: int
    currentPrice: float
    wishlistPrice: float
    notes: Optional[str] = None

class BacklogCreate(BacklogBase):
    pass

class BacklogUpdate(BaseModel):
    title: Optional[str] = None
    platform: Optional[str] = None
    genre: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    developer: Optional[str] = None
    releaseDate: Optional[str] = None
    cover: Optional[str] = None
    estimatedPlaytime: Optional[int] = None
    currentPrice: Optional[float] = None
    wishlistPrice: Optional[float] = None
    notes: Optional[str] = None

class Backlog(BacklogBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# User Preferences Models
class PreferencesBase(BaseModel):
    language: str = "en"

class PreferencesCreate(PreferencesBase):
    pass

class PreferencesUpdate(BaseModel):
    language: Optional[str] = None

class Preferences(PreferencesBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Response Models
class StatsResponse(BaseModel):
    totalGames: int
    completed: int
    inProgress: int
    totalPlaytime: int
    avgRating: float
    backlogCount: int

class MoveToLibraryRequest(BaseModel):
    status: str = "Not Started"
    rating: float = 0.0
    playtime: int = 0
    progress: int = 0
    startDate: Optional[str] = None
    completionDate: Optional[str] = None
    notes: Optional[str] = None
# GameVault - Backend Implementation Contracts

## API Contracts

### Base URL: `/api`

### 1. Games Management
- `GET /api/games` - Get all games with filters (platform, genre, status)
- `POST /api/games` - Add new game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game
- `GET /api/games/stats` - Get dashboard statistics

### 2. Backlog Management  
- `GET /api/backlog` - Get backlog games with filters (category, priority)
- `POST /api/backlog` - Add game to backlog
- `PUT /api/backlog/:id` - Update backlog game
- `DELETE /api/backlog/:id` - Remove from backlog
- `POST /api/backlog/:id/move-to-library` - Move backlog game to main library

### 3. User Preferences
- `GET /api/preferences` - Get user preferences (language, etc.)
- `PUT /api/preferences` - Update user preferences

## Data Models

### Game Model
```javascript
{
  id: ObjectId,
  title: String,
  platform: String,
  genre: String,
  status: String, // "Completed", "In Progress", "Dropped", "Not Started"
  rating: Number,
  playtime: Number,
  developer: String,
  releaseDate: Date,
  startDate: Date,
  completionDate: Date,
  cover: String, // URL
  progress: Number, // 0-100
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Backlog Model
```javascript
{
  id: ObjectId,
  title: String,
  platform: String,
  genre: String,
  category: String, // "Next to Play", "Maybe Later", "Wishlist"
  priority: String, // "High", "Medium", "Low"
  developer: String,
  releaseDate: Date,
  cover: String,
  estimatedPlaytime: Number,
  currentPrice: Number,
  wishlistPrice: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User Preferences Model
```javascript
{
  id: ObjectId,
  language: String, // "en", "pt-BR"
  createdAt: Date,
  updatedAt: Date
}
```

## Mock Data Migration

### Current Mock Data (mock.js) to Replace:
1. `mockGames` array → MongoDB games collection
2. `mockBacklog` array → MongoDB backlog collection
3. Static filters → Database queries with aggregation

### Frontend Integration Changes:
1. Replace mock data imports with API calls
2. Add loading states for API requests
3. Add error handling for failed requests
4. Implement optimistic updates for better UX

## Backend Implementation Plan

### Phase 1: Database Models & Basic CRUD
- MongoDB models for games, backlog, preferences
- Basic CRUD endpoints
- Data validation using Pydantic

### Phase 2: Business Logic
- Statistics calculation for dashboard
- Move games between backlog and library
- Filter and search functionality

### Phase 3: Internationalization
- Language preference storage
- Multi-language support for UI strings

### Phase 4: Frontend Integration
- Replace mock data with API calls
- Add language switching functionality
- Error handling and loading states

## Error Handling Strategy
- Standardized error responses
- Input validation
- Database connection error handling
- Graceful degradation for missing data
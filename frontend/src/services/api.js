import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
});

// Games API
export const gamesApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.platform && filters.platform !== 'All') params.append('platform', filters.platform);
    if (filters.genre && filters.genre !== 'All') params.append('genre', filters.genre);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    return apiClient.get(`/games?${params.toString()}`);
  },
  
  getById: (id) => apiClient.get(`/games/${id}`),
  
  create: (gameData) => apiClient.post('/games', gameData),
  
  update: (id, gameData) => apiClient.put(`/games/${id}`, gameData),
  
  delete: (id) => apiClient.delete(`/games/${id}`),
  
  getStats: () => apiClient.get('/games/stats/dashboard'),
};

// Backlog API
export const backlogApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.platform && filters.platform !== 'All') params.append('platform', filters.platform);
    
    return apiClient.get(`/backlog?${params.toString()}`);
  },
  
  getById: (id) => apiClient.get(`/backlog/${id}`),
  
  create: (backlogData) => apiClient.post('/backlog', backlogData),
  
  update: (id, backlogData) => apiClient.put(`/backlog/${id}`, backlogData),
  
  delete: (id) => apiClient.delete(`/backlog/${id}`),
  
  moveToLibrary: (id, moveData) => apiClient.post(`/backlog/${id}/move-to-library`, moveData),
};

// Preferences API
export const preferencesApi = {
  get: () => apiClient.get('/preferences'),
  
  update: (preferencesData) => apiClient.put('/preferences', preferencesData),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.detail || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response
    return {
      message: 'Unable to connect to server',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
    };
  }
};

// Helper functions for data processing
export const getGamesByPlatform = (games) => {
  const platforms = [...new Set(games.map(game => game.platform))];
  return platforms.map(platform => ({
    platform,
    games: games.filter(game => game.platform === platform)
  }));
};

export const getBacklogByCategory = (backlog, category) => {
  return backlog.filter(item => item.category === category);
};

export default apiClient;
// Mock data for gaming system
export const mockGames = [
  {
    id: "1",
    title: "The Witcher 3: Wild Hunt",
    platform: "PC",
    genre: "RPG",
    status: "Completed",
    rating: 9.5,
    playtime: 127,
    developer: "CD Projekt RED",
    releaseDate: "2015-05-19",
    completionDate: "2024-06-15",
    cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=400&fit=crop",
    progress: 100,
    notes: "Incredible story and world-building. One of the best RPGs ever made."
  },
  {
    id: "2",
    title: "Cyberpunk 2077",
    platform: "PC",
    genre: "RPG",
    status: "In Progress",
    rating: 8.0,
    playtime: 45,
    developer: "CD Projekt RED",
    releaseDate: "2020-12-10",
    startDate: "2024-05-20",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop",
    progress: 65,
    notes: "Finally playing after all the patches. Much better now!"
  },
  {
    id: "3",
    title: "God of War",
    platform: "PlayStation 5",
    genre: "Action",
    status: "Completed",
    rating: 9.0,
    playtime: 35,
    developer: "Santa Monica Studio",
    releaseDate: "2018-04-20",
    completionDate: "2024-04-10",
    cover: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=400&fit=crop",
    progress: 100,
    notes: "Amazing father-son journey. Combat feels incredible."
  },
  {
    id: "4",
    title: "Hades",
    platform: "Nintendo Switch",
    genre: "Roguelike",
    status: "Completed",
    rating: 9.2,
    playtime: 68,
    developer: "Supergiant Games",
    releaseDate: "2020-09-17",
    completionDate: "2024-03-22",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
    progress: 100,
    notes: "Perfect roguelike. Addictive gameplay and great story."
  },
  {
    id: "5",
    title: "Elden Ring",
    platform: "PC",
    genre: "RPG",
    status: "Dropped",
    rating: 7.5,
    playtime: 22,
    developer: "FromSoftware",
    releaseDate: "2022-02-25",
    startDate: "2024-02-15",
    cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
    progress: 25,
    notes: "Too difficult for my current gaming time availability."
  }
];

export const mockBacklog = [
  {
    id: "b1",
    title: "Baldur's Gate 3",
    platform: "PC",
    genre: "RPG",
    category: "Next to Play",
    priority: "High",
    developer: "Larian Studios",
    releaseDate: "2023-08-03",
    cover: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop",
    estimatedPlaytime: 75,
    currentPrice: 59.99,
    wishlistPrice: 40.00,
    notes: "Waiting for a good sale. Heard amazing things about it."
  },
  {
    id: "b2",
    title: "Spider-Man: Miles Morales",
    platform: "PlayStation 5",
    genre: "Action",
    category: "Maybe Later",
    priority: "Medium",
    developer: "Insomniac Games",
    releaseDate: "2020-11-12",
    cover: "https://images.unsplash.com/photo-1635805737707-71b2d3c05b15?w=300&h=400&fit=crop",
    estimatedPlaytime: 12,
    currentPrice: 39.99,
    wishlistPrice: 25.00,
    notes: "Short but sweet Spider-Man experience."
  },
  {
    id: "b3",
    title: "Horizon Forbidden West",
    platform: "PlayStation 5",
    genre: "Action RPG",
    category: "Wishlist",
    priority: "High",
    developer: "Guerrilla Games",
    releaseDate: "2022-02-18",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
    estimatedPlaytime: 55,
    currentPrice: 49.99,
    wishlistPrice: 30.00,
    notes: "Sequel to Zero Dawn. Amazing visuals!"
  },
  {
    id: "b4",
    title: "Stray",
    platform: "PC",
    genre: "Adventure",
    category: "Next to Play",
    priority: "Low",
    developer: "BlueTwelve Studio",
    releaseDate: "2022-07-19",
    cover: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=400&fit=crop",
    estimatedPlaytime: 8,
    currentPrice: 29.99,
    wishlistPrice: 20.00,
    notes: "Cyberpunk cat adventure. Perfect for relaxing."
  }
];

export const platforms = ["All", "PC", "PlayStation 5", "Nintendo Switch", "Xbox Series X"];
export const genres = ["All", "RPG", "Action", "Roguelike", "Adventure", "Action RPG"];
export const statuses = ["All", "Completed", "In Progress", "Dropped", "Not Started"];
export const priorities = ["High", "Medium", "Low"];
export const categories = ["Next to Play", "Maybe Later", "Wishlist"];

export const getGamesByPlatform = () => {
  return platforms.slice(1).map(platform => ({
    platform,
    games: mockGames.filter(game => game.platform === platform)
  }));
};

export const getStats = () => {
  const completed = mockGames.filter(game => game.status === "Completed").length;
  const inProgress = mockGames.filter(game => game.status === "In Progress").length;
  const totalPlaytime = mockGames.reduce((sum, game) => sum + game.playtime, 0);
  const avgRating = mockGames.reduce((sum, game) => sum + game.rating, 0) / mockGames.length;
  
  return {
    totalGames: mockGames.length,
    completed,
    inProgress,
    totalPlaytime,
    avgRating: Math.round(avgRating * 10) / 10,
    backlogCount: mockBacklog.length
  };
};
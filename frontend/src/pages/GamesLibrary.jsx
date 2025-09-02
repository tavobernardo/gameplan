import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { gamesApi, handleApiError } from "../services/api";
import { mockGames, platforms, genres, statuses } from "../mock";
import { Search, Filter, Star, Clock, Calendar, Plus } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function GamesLibrary() {
  const { t } = useLanguage();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [genreFilter, setGenreFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.developer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === "All" || game.platform === platformFilter;
    const matchesGenre = genreFilter === "All" || game.genre === genreFilter;
    const matchesStatus = statusFilter === "All" || game.status === statusFilter;
    
    return matchesSearch && matchesPlatform && matchesGenre && matchesStatus;
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await gamesApi.getAll();
      setGames(response.data);
      setUsingMockData(false);
    } catch (err) {
      console.warn('API unavailable, using mock data:', err);
      setGames(mockGames);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gamesLibrary')}</h1>
          <p className="text-gray-600 mt-1">{t('manageCollection')}</p>
        </div>
        <div className="flex items-center space-x-3">
          {usingMockData && (
            <Badge variant="outline" className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 border-yellow-200">
              Demo Mode
            </Badge>
          )}
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            {t('addGame')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchGames')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading games...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
            <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
              <img
                src={game.cover}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={game.status === "Completed" ? "default" : game.status === "In Progress" ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {game.status}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 truncate mb-1">{game.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{game.developer}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="bg-gray-100 px-2 py-1 rounded">{game.platform}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{game.genre}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{game.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="text-sm">{game.playtime}h</span>
                </div>
              </div>
              
              {game.notes && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{game.notes}</p>
              )}
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!loading && games.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{t('noGamesMatchingFilters')}</p>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { gamesApi, getGamesByPlatform, handleApiError } from "../services/api";
import { platforms } from "../mock";
import { Calendar, Star, Clock, Trophy, Gamepad2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Timeline() {
  const { t } = useLanguage();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await gamesApi.getAll();
        setGames(response.data);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading timeline...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  const gamesByPlatform = getGamesByPlatform(games);
  const filteredData = selectedPlatform === "All" 
    ? gamesByPlatform 
    : gamesByPlatform.filter(platform => platform.platform === selectedPlatform);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gamingTimeline')}</h1>
          <p className="text-gray-600 mt-1">{t('visualJourney')}</p>
        </div>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {platforms.map(platform => (
              <SelectItem key={platform} value={platform}>{platform}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredData.map((platformData, platformIndex) => (
        <Card key={platformData.platform} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Gamepad2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{platformData.platform}</h2>
                <p className="text-sm text-gray-600 font-normal">{platformData.games.length} games</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200"></div>
              
              <div className="space-y-0">
                {platformData.games
                  .sort((a, b) => {
                    const dateA = new Date(a.completionDate || a.startDate || a.releaseDate);
                    const dateB = new Date(b.completionDate || b.startDate || b.releaseDate);
                    return dateB - dateA;
                  })
                  .map((game, gameIndex) => (
                    <div key={game.id} className="relative flex items-start p-6 hover:bg-gray-50 transition-colors duration-200">
                      {/* Timeline dot */}
                      <div className="absolute left-5 top-8 w-3 h-3 bg-white border-3 border-blue-500 rounded-full shadow-sm z-10"></div>
                      
                      {/* Content */}
                      <div className="ml-8 flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={game.cover}
                              alt={game.title}
                              className="w-20 h-28 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{game.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{game.developer} • {game.genre}</p>
                                
                                <div className="flex items-center space-x-4 mb-3">
                                  <Badge 
                                    variant={game.status === "Completed" ? "default" : game.status === "In Progress" ? "secondary" : "destructive"}
                                    className="text-xs"
                                  >
                                    {game.status === "Completed" && <Trophy className="h-3 w-3 mr-1" />}
                                    {game.status}
                                  </Badge>
                                  
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="text-sm font-medium">{game.rating}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-sm">{game.playtime}h</span>
                                  </div>
                                </div>
                                
                                {game.notes && (
                                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{game.notes}</p>
                                )}
                              </div>
                              
                              <div className="text-right ml-4">
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {game.completionDate ? "Completed" : game.startDate ? "Started" : "Released"}
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDate(game.completionDate || game.startDate || game.releaseDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No games found for the selected platform</p>
        </div>
      )}
    </div>
  );
}
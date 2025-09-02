import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { gamesApi, handleApiError } from "../services/api";
import { Trophy, Clock, Target, Star, TrendingUp, Calendar } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalGames: 0,
    completed: 0,
    inProgress: 0,
    totalPlaytime: 0,
    avgRating: 0,
    backlogCount: 0
  });
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats and games in parallel
        const [statsResponse, gamesResponse] = await Promise.all([
          gamesApi.getStats(),
          gamesApi.getAll()
        ]);
        
        setStats(statsResponse.data);
        setGames(gamesResponse.data);
        
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
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

  const recentGames = games.slice(0, 3);
  const currentlyPlaying = games.filter(game => game.status === "In Progress");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('gamingDashboard')}</h1>
          <p className="text-gray-600 mt-1">{t('trackJourney')}</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <Calendar className="h-4 w-4 mr-1" />
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalGames')}</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
            <p className="text-xs text-gray-600 mt-1">{t('inYourCollection')}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completed')}</CardTitle>
            <Trophy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            <p className="text-xs text-gray-600 mt-1">{t('gamesFinished')}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('playtime')}</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPlaytime}h</div>
            <p className="text-xs text-gray-600 mt-1">{t('totalHoursPlayed')}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgRating')}</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.avgRating}</div>
            <p className="text-xs text-gray-600 mt-1">{t('averageScore')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currently Playing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              {t('currentlyPlaying')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentlyPlaying.length > 0 ? (
              currentlyPlaying.map((game) => (
                <div key={game.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={game.cover}
                    alt={game.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{game.title}</h3>
                    <p className="text-sm text-gray-600">{game.platform} • {game.playtime}h played</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>{t('progress')}</span>
                        <span>{game.progress}%</span>
                      </div>
                      <Progress value={game.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t('noGamesInProgress')}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              {t('recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentGames.map((game) => (
              <div key={game.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={game.cover}
                  alt={game.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{game.title}</h3>
                  <p className="text-sm text-gray-600">{game.platform} • {game.genre}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={game.status === "Completed" ? "default" : game.status === "In Progress" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {game.status}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{game.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
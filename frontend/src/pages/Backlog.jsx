import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { backlogApi, handleApiError } from "../services/api";
import { mockBacklog, categories, priorities } from "../mock";
import { Plus, Star, Clock, DollarSign, TrendingDown, Bookmark, Target, Heart } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Backlog() {
  const { t } = useLanguage();
  const [backlog, setBacklog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    const fetchBacklog = async () => {
      try {
        setLoading(true);
        const response = await backlogApi.getAll();
        setBacklog(response.data);
        setUsingMockData(false);
      } catch (err) {
        console.warn('API unavailable, using mock data:', err);
        setBacklog(mockBacklog);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBacklog();
  }, []);

  const filteredBacklog = backlog.filter(game => {
    const matchesCategory = categoryFilter === "All" || game.category === categoryFilter;
    const matchesPriority = priorityFilter === "All" || game.priority === priorityFilter;
    return matchesCategory && matchesPriority;
  });

  const getBacklogByCategory = (category) => {
    return backlog.filter(game => game.category === category);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Next to Play": return Target;
      case "Maybe Later": return Clock;
      case "Wishlist": return Heart;
      default: return Bookmark;
    }
  };

  const GameCard = ({ game }) => (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
      <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
        <img
          src={game.cover}
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={getPriorityColor(game.priority)}>
            {game.priority}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-white/90 text-xs">
            {game.platform}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">{game.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{game.developer}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded">{game.genre}</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{game.estimatedPlaytime}h</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Price:</span>
            <span className="font-semibold text-gray-900">${game.currentPrice}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Target Price:</span>
            <span className="font-semibold text-green-600">${game.wishlistPrice}</span>
          </div>
          {game.currentPrice > game.wishlistPrice && (
            <div className="flex items-center justify-center text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <TrendingDown className="h-3 w-3 mr-1" />
              Wait for {Math.round(((game.currentPrice - game.wishlistPrice) / game.currentPrice) * 100)}% discount
            </div>
          )}
        </div>
        
        {game.notes && (
          <p className="text-xs text-gray-600 mt-3 line-clamp-2">{game.notes}</p>
        )}
        
        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-xs">
          Move to Library
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Game Backlog</h1>
          <p className="text-gray-600 mt-1">Organize your future gaming adventures</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add to Backlog
        </Button>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">By Categories</TabsTrigger>
          <TabsTrigger value="all">All Games</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {categories.map((category) => {
            const categoryGames = getBacklogByCategory(category);
            const Icon = getCategoryIcon(category);
            
            return (
              <Card key={category}>
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <CardTitle className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <span>{category}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {categoryGames.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {categoryGames.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categoryGames.map((game) => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No games in this category</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBacklog.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {filteredBacklog.length === 0 && (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No games found matching your filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
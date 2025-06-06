"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Crown,
  Users,
  Zap,
  Trophy,
  Clock,
  MessageCircle,
  Bell,
  Eye,
  Star,
  Gamepad2,
  Send,
  ChevronRight,
  Award,
  Settings,
} from "lucide-react";

// Mock data
const currentUser = {
  username: "NeuralMaster",
  avatar: "/placeholder.svg?height=64&width=64&text=NM",
  rating: 1850,
  xp: 2750,
  maxXp: 3000,
  level: 12,
  title: "Cyber Knight",
};

const friends = [
  {
    id: 1,
    username: "QuantumQueen",
    avatar: "/placeholder.svg?height=40&width=40&text=QQ",
    status: "online",
    rating: 1920,
    lastSeen: "now",
  },
  {
    id: 2,
    username: "DataGrandmaster",
    avatar: "/placeholder.svg?height=40&width=40&text=DG",
    status: "playing",
    rating: 2100,
    lastSeen: "5m ago",
  },
  {
    id: 3,
    username: "CodeWarrior",
    avatar: "/placeholder.svg?height=40&width=40&text=CW",
    status: "online",
    rating: 1780,
    lastSeen: "now",
  },
  {
    id: 4,
    username: "AlgoAssassin",
    avatar: "/placeholder.svg?height=40&width=40&text=AA",
    status: "away",
    rating: 1650,
    lastSeen: "15m ago",
  },
  {
    id: 5,
    username: "ByteBishop",
    avatar: "/placeholder.svg?height=40&width=40&text=BB",
    status: "offline",
    rating: 1590,
    lastSeen: "2h ago",
  },
];

const leaderboard = [
  {
    rank: 1,
    username: "CyberGrandmaster",
    rating: 2450,
    change: "+25",
    avatar: "/placeholder.svg?height=32&width=32&text=CG",
  },
  {
    rank: 2,
    username: "NeuralNetwork",
    rating: 2380,
    change: "+12",
    avatar: "/placeholder.svg?height=32&width=32&text=NN",
  },
  {
    rank: 3,
    username: "QuantumLogic",
    rating: 2340,
    change: "-8",
    avatar: "/placeholder.svg?height=32&width=32&text=QL",
  },
  {
    rank: 4,
    username: "DataMaster",
    rating: 2290,
    change: "+18",
    avatar: "/placeholder.svg?height=32&width=32&text=DM",
  },
  {
    rank: 5,
    username: "CodeChampion",
    rating: 2250,
    change: "+5",
    avatar: "/placeholder.svg?height=32&width=32&text=CC",
  },
];

const achievements = [
  {
    id: 1,
    name: "First Victory",
    description: "Win your first game",
    icon: Trophy,
    unlocked: true,
    rarity: "common",
  },
  {
    id: 2,
    name: "Speed Demon",
    description: "Win 10 blitz games",
    icon: Zap,
    unlocked: true,
    rarity: "rare",
  },
  {
    id: 3,
    name: "Neural Link",
    description: "Play 100 games",
    icon: Crown,
    unlocked: false,
    rarity: "epic",
  },
  {
    id: 4,
    name: "Grandmaster",
    description: "Reach 2000 rating",
    icon: Star,
    unlocked: false,
    rarity: "legendary",
  },
];

const ongoingGames = [
  {
    id: 1,
    white: "CyberKnight",
    black: "DataLord",
    time: "15:32",
    spectators: 12,
    whiteRating: 1850,
    blackRating: 1920,
  },
  {
    id: 2,
    white: "QuantumQueen",
    black: "AlgoMaster",
    time: "08:45",
    spectators: 8,
    whiteRating: 1920,
    blackRating: 1780,
  },
  {
    id: 3,
    white: "NeuralNet",
    black: "CodeWarrior",
    time: "22:18",
    spectators: 15,
    whiteRating: 2100,
    blackRating: 1890,
  },
];

const chatMessages = [
  {
    id: 1,
    username: "CyberKnight",
    message: "Anyone up for a quick blitz?",
    time: "2m ago",
    avatar: "/placeholder.svg?height=24&width=24&text=CK",
  },
  {
    id: 2,
    username: "QuantumQueen",
    message: "GG everyone! Great tournament",
    time: "5m ago",
    avatar: "/placeholder.svg?height=24&width=24&text=QQ",
  },
  {
    id: 3,
    username: "DataMaster",
    message: "New neural chess algorithm is insane!",
    time: "8m ago",
    avatar: "/placeholder.svg?height=24&width=24&text=DM",
  },
];

const notifications = [
  {
    id: 1,
    type: "challenge",
    from: "QuantumQueen",
    message: "challenged you to a game",
    time: "2m ago",
  },
  {
    id: 2,
    type: "friend",
    from: "CodeWarrior",
    message: "sent you a friend request",
    time: "5m ago",
  },
  {
    id: 3,
    type: "system",
    message: "Tournament starting in 10 minutes",
    time: "8m ago",
  },
];

export function ChessLobby() {
  const [selectedGameMode, setSelectedGameMode] = useState("blitz");
  const [chatMessage, setChatMessage] = useState("");
  const [leaderboardFilter, setLeaderboardFilter] = useState("daily");
  const [showNotifications, setShowNotifications] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-cyan-400";
      case "playing":
        return "bg-fuchsia-400";
      case "away":
        return "bg-yellow-400";
      default:
        return "bg-gray-600";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-500";
      case "rare":
        return "border-cyan-500";
      case "epic":
        return "border-fuchsia-500";
      case "legendary":
        return "border-yellow-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-fuchsia-900/20" />
        <div className="scan-lines" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with User Profile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-cyan-500 neural-pulse">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg"}
                alt={currentUser.username}
              />
              <AvatarFallback className="bg-black text-cyan-400 text-lg">
                {currentUser.username.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-cyan-400 neon-text">
                  {currentUser.username}
                </h1>
                <Badge className="bg-fuchsia-950/50 text-fuchsia-400 border-fuchsia-500">
                  {currentUser.title}
                </Badge>
              </div>
              <p className="text-cyan-300">
                Neural Rating: {currentUser.rating}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-400">
                  Level {currentUser.level}
                </span>
                <Progress
                  value={(currentUser.xp / currentUser.maxXp) * 100}
                  className="w-32 h-2"
                />
                <span className="text-xs text-gray-400">
                  {currentUser.xp}/{currentUser.maxXp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/30 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-fuchsia-500 rounded-full animate-pulse" />
              )}
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-80 bg-black/90 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm z-50"
              >
                <h3 className="text-cyan-400 font-bold mb-3">Neural Alerts</h3>
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-center space-x-2 p-2 bg-cyan-950/20 rounded-sm"
                    >
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          {notif.from && (
                            <span className="text-cyan-400">{notif.from}</span>
                          )}{" "}
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Friends & Chat */}
          <div className="col-span-3 space-y-6">
            {/* Friends List */}
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

              <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Neural Allies (
                {friends.filter((f) => f.status === "online").length} online)
              </h3>

              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center space-x-3 p-2 rounded-sm bg-black/30 hover:bg-cyan-950/20 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 border border-cyan-500">
                          <AvatarImage
                            src={friend.avatar || "/placeholder.svg"}
                            alt={friend.username}
                          />
                          <AvatarFallback className="bg-black text-cyan-400 text-xs">
                            {friend.username.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(
                            friend.status
                          )}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {friend.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {friend.rating} • {friend.lastSeen}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300"
                        >
                          <Gamepad2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Global Chat */}
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

              <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Neural Network Chat
              </h3>

              <ScrollArea className="h-48 mb-3">
                <div className="space-y-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={msg.avatar || "/placeholder.svg"}
                          alt={msg.username}
                        />
                        <AvatarFallback className="bg-black text-cyan-400 text-xs">
                          {msg.username.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-cyan-400 text-sm font-medium">
                            {msg.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {msg.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Input
                  placeholder="Enter neural message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-black/50 border-cyan-900 text-white placeholder-gray-500"
                />
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="col-span-6 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-16 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                <Zap className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-bold">Quick Match</div>
                  <div className="text-xs opacity-80">Find random opponent</div>
                </div>
              </Button>

              <Button className="h-16 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 text-white shadow-[0_0_20px_rgba(255,0,255,0.3)]">
                <Users className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-bold">Challenge Friend</div>
                  <div className="text-xs opacity-80">Invite ally to duel</div>
                </div>
              </Button>
            </div>

            {/* Game Modes */}
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-6 backdrop-blur-sm">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

              <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Neural Game Modes
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    id: "blitz",
                    name: "Blitz",
                    time: "3+2",
                    icon: Zap,
                    color: "cyan",
                  },
                  {
                    id: "rapid",
                    name: "Rapid",
                    time: "10+5",
                    icon: Clock,
                    color: "fuchsia",
                  },
                  {
                    id: "classical",
                    name: "Classical",
                    time: "30+0",
                    icon: Crown,
                    color: "yellow",
                  },
                  {
                    id: "custom",
                    name: "Custom",
                    time: "Custom",
                    icon: Settings,
                    color: "green",
                  },
                ].map((mode) => (
                  <Button
                    key={mode.id}
                    variant={
                      selectedGameMode === mode.id ? "default" : "outline"
                    }
                    className={`h-16 ${
                      selectedGameMode === mode.id
                        ? `bg-${mode.color}-600 hover:bg-${mode.color}-500 text-white`
                        : `border-${mode.color}-500 text-${mode.color}-400 hover:bg-${mode.color}-950/30`
                    }`}
                    onClick={() => setSelectedGameMode(mode.id)}
                  >
                    <mode.icon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-bold">{mode.name}</div>
                      <div className="text-xs opacity-80">{mode.time}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Ongoing Games */}
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-6 backdrop-blur-sm">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

              <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Live Neural Duels
              </h3>

              <div className="space-y-3">
                {ongoingGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center space-x-4 p-3 bg-black/30 rounded-sm hover:bg-cyan-950/20 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-900 to-fuchsia-900 rounded-sm flex items-center justify-center">
                      <Crown className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">
                          {game.white}
                        </span>
                        <span className="text-xs text-cyan-400">
                          ({game.whiteRating})
                        </span>
                        <span className="text-fuchsia-400">vs</span>
                        <span className="text-white font-medium">
                          {game.black}
                        </span>
                        <span className="text-xs text-fuchsia-400">
                          ({game.blackRating})
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {game.time}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {game.spectators}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/30"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Watch
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Leaderboard */}
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-cyan-400 font-bold flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Neural Rankings
                </h3>
                <Tabs
                  value={leaderboardFilter}
                  onValueChange={setLeaderboardFilter}
                  className="w-auto"
                >
                  <TabsList className="bg-black/50 border border-cyan-900">
                    <TabsTrigger value="daily" className="text-xs">
                      Daily
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="text-xs">
                      Weekly
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center space-x-3 p-2 rounded-sm bg-black/30"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        player.rank === 1
                          ? "bg-yellow-500 text-black"
                          : player.rank === 2
                          ? "bg-gray-400 text-black"
                          : player.rank === 3
                          ? "bg-orange-500 text-black"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {player.rank}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.username}
                      />
                      <AvatarFallback className="bg-black text-cyan-400 text-xs">
                        {player.username.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {player.username}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-cyan-400">
                          {player.rating}
                        </span>
                        <span
                          className={`text-xs ${
                            player.change.startsWith("+")
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {player.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-black/50 border border-cyan-900 rounded-sm p-4 backdrop-blur-sm">
              <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-sm -z-10" />

              <h3 className="text-cyan-400 font-bold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Neural Achievements
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-sm border-2 ${getRarityColor(
                      achievement.rarity
                    )} ${
                      achievement.unlocked
                        ? "bg-black/30"
                        : "bg-gray-900/50 opacity-50"
                    } hover:scale-105 transition-transform cursor-pointer`}
                    title={achievement.description}
                  >
                    <achievement.icon
                      className={`h-6 w-6 mx-auto mb-2 ${
                        achievement.unlocked ? "text-cyan-400" : "text-gray-600"
                      }`}
                    />
                    <p
                      className={`text-xs text-center font-medium ${
                        achievement.unlocked ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {achievement.name}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 text-xs"
              >
                View All Achievements
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

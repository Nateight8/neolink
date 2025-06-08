import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { Bell } from "lucide-react";
import { motion } from "motion/react";

export default function LobbyHeader({
  currentUser,
  notifications,
  showNotifications,
  setShowNotifications,
}: {
  currentUser: {
    id: number;
    username: string;
    avatar: string;
    status: string;
    rating: number;
    xp: number;
    maxXp: number;
    level: number;
    title: string;
  };
  notifications: {
    id: number;
    type: string;
    from?: string; // Made optional with ?
    message: string;
    time: string;
  }[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}) {
  const { user } = useAuth();

  return (
    <>
      {" "}
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
            <p className="text-cyan-300">Neural Rating: {currentUser.rating}</p>
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
    </>
  );
}

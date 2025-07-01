import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
// import { Bell } from "lucide-react";
// import { motion } from "motion/react";

interface Notification {
  id: number;
  type: string;
  from?: string;
  message: string;
  time: string;
}

export default function LobbyHeader({}: // notifications = [],
// showNotifications = false,
// setShowNotifications = () => {},
{
  notifications?: Notification[];
  showNotifications?: boolean;
  setShowNotifications?: (show: boolean) => void;
}) {
  const { user, isError } = useAuth();
  const [guestUsername, setGuestUsername] = useState<string>("Neural_Guest");

  // Set random guest username on client side only
  useEffect(() => {
    if (!user) {
      setGuestUsername("Neural_Guest_" + Math.floor(Math.random() * 10000));
    }
  }, [user]);

  // Default values for unauthenticated users
  const currentUser = {
    id: user?._id || "guest",
    username: user?.username || guestUsername,
    avatar: user?.avatar || "/cyberpunk-avatar.png",
    status: "online",
    rating: user?.rating || 1200,
    xp: 0,
    maxXp: 1000,
    level: user?.level || 1,
    title: user ? user.title || "Neural Novice" : "Neural Drifter",
    ...user, // Spread user data to override any defaults if available
  };

  // State for random cyberpunk color (client-side only)
  const [randomColor, setRandomColor] = useState("text-cyan-400");

  // Set random color on client side only
  useEffect(() => {
    const cyberpunkColors = [
      "text-cyan-400",
      "text-fuchsia-400",
      "text-purple-400",
      "text-blue-400",
      "text-green-400",
    ];
    setRandomColor(cyberpunkColors[Math.floor(Math.random() * cyberpunkColors.length)]);
  }, []);

  return (
    <>
      {" "}
      <div className="flex items-center justify-between mb-8 p-4 bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg shadow-lg shadow-cyan-500/10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Avatar className="h-16 w-16 border-2 border-cyan-500 relative z-10 bg-gray-900">
              <AvatarImage
                src={currentUser.avatar}
                alt={currentUser.username}
              />
              <AvatarFallback
                className={`bg-gray-900 ${randomColor} text-xl font-mono`}
              >
                {currentUser.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1
                className={`text-2xl font-bold ${randomColor} font-mono tracking-wide`}
              >
                {currentUser.username}
              </h1>
              <Badge className="bg-fuchsia-900/80 text-fuchsia-300 border-fuchsia-500/50 font-mono text-xs">
                {currentUser.title}
              </Badge>
              {!user && !isError && (
                <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  GUEST MODE
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-2">
                <p className="text-cyan-300 text-sm font-mono">
                  <span className="text-cyan-500">RATING:</span>{" "}
                  {currentUser.rating}
                </p>
                <div className="h-4 w-px bg-cyan-500/30"></div>
                <p className="text-fuchsia-300 text-sm font-mono">
                  <span className="text-fuchsia-500">LEVEL:</span>{" "}
                  {currentUser.level}
                </p>
              </div>
              <div className="h-1.5 w-24 bg-gray-800/80 rounded-full overflow-hidden border border-cyan-500/20">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${(currentUser.xp / currentUser.maxXp) * 100}%`,
                    boxShadow: "0 0 8px rgba(6, 182, 212, 0.6)",
                  }}
                />
              </div>
              <span className="text-xs text-cyan-300 font-mono">
                {currentUser.xp}
                <span className="text-cyan-500/80">
                  /{currentUser.maxXp} XP
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {/* <div className="relative">
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
        </div> */}
      </div>
    </>
  );
}

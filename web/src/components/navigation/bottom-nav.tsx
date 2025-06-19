"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gamepad2, User, MessageSquare, Settings } from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
  { name: "Games", href: "/games", icon: <Gamepad2 className="h-5 w-5" /> },
  { name: "Chat", href: "/chat", icon: <MessageSquare className="h-5 w-5" /> },
  { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 bg-background border-t border-cyan-900/50 left-0 right-0 z-50">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col flex-1 items-center p-2 rounded-lg transition-all duration-200 ${
                isActive ? "text-cyan-400" : "text-gray-400 hover:text-cyan-300"
              }`}
            >
              <div
                className={`relative p-2 rounded-full ${
                  isActive ? "bg-cyan-900/30" : ""
                }`}
              >
                {item.icon}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full border border-cyan-200"></span>
                )}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

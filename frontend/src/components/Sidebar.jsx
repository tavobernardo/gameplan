import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Library, Clock, Bookmark, Gamepad2 } from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Games Library", href: "/games", icon: Library },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Backlog", href: "/backlog", icon: Bookmark },
];

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">GameVault</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700",
                  isActive
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )
              }
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Track • Organize • Enjoy
        </div>
      </div>
    </div>
  );
}
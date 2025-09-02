import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Library, Clock, Bookmark, Gamepad2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Sidebar() {
  const { t } = useLanguage();
  
  const navigation = [
    { name: t('dashboard'), href: "/", icon: Home },
    { name: t('gamesLibrary'), href: "/games", icon: Library },
    { name: t('timeline'), href: "/timeline", icon: Clock },
    { name: t('backlog'), href: "/backlog", icon: Bookmark },
  ];

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
      
      <div className="p-4 border-t border-gray-200 space-y-3">
        <LanguageSwitcher />
        <div className="text-xs text-gray-500 text-center">
          {t('track')} • {t('organize')} • {t('enjoy')}
        </div>
      </div>
    </div>
  );
}
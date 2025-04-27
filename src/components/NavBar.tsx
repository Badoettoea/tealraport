
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home, User, Settings, Book } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const getDashboardPath = () => {
    return user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard";
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background py-2 border-t">
      <nav className="max-w-md mx-auto flex items-center justify-around">
        <Link to={getDashboardPath()} className={`neu-tab flex flex-col items-center ${isActive(getDashboardPath()) ? "active" : ""}`}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to={getDashboardPath()} className={`neu-tab flex flex-col items-center ${isActive("/grades") ? "active" : ""}`}>
          <Book className="h-5 w-5" />
          <span className="text-xs mt-1">Grades</span>
        </Link>
        
        <Link to={getDashboardPath()} className={`neu-tab flex flex-col items-center ${isActive("/profile") ? "active" : ""}`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        
        <Link to={getDashboardPath()} className={`neu-tab flex flex-col items-center ${isActive("/settings") ? "active" : ""}`}>
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default NavBar;

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  role: "user" | "admin";
  profileImage: string;
  additionalInfo?: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (pin: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Ganti dengan URL dari Google Apps Script Anda

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (pin: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=login&pin=${pin}`);
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");
      } else {
        toast.error(data.error || "Invalid PIN, please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out.");
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        login, 
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

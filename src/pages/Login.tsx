
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock } from "lucide-react";

const Login = () => {
  const [pin, setPin] = useState("");
  const [isPinVisible, setIsPinVisible] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    
    await login(pin);
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (userData?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (userData?.role === "user") {
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-secondary animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-teal-600 mb-2">Welcome</h1>
          <p className="text-muted-foreground">Enter your PIN to continue</p>
        </div>
        
        <div className="neu-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="pin" className="block text-sm font-medium">
                PIN
              </label>
              <div className="relative">
                <Input
                  id="pin"
                  type={isPinVisible ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="neu-input w-full pl-10"
                  placeholder="Enter your PIN"
                  autoComplete="off"
                  maxLength={6}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setIsPinVisible(!isPinVisible)}
                >
                  {isPinVisible ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use PIN "1234" for user or "admin" for admin access
              </p>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || !pin}
              className="neu-button w-full h-12 font-medium text-primary-foreground bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>This is a demo application with Google Sheets integration</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

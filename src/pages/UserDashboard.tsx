
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Upload, Home, Settings, Book } from "lucide-react";
import NavBar from "@/components/NavBar";

interface GradeItem {
  subject: string;
  grade: string | number;
  semester: string;
}

// Mock grades data (in a real app, this would come from Google Sheets)
const mockGrades: GradeItem[] = [
  { subject: "Mathematics", grade: "A", semester: "Semester 1" },
  { subject: "Physics", grade: "B+", semester: "Semester 1" },
  { subject: "Chemistry", grade: "A-", semester: "Semester 1" },
  { subject: "Biology", grade: 85, semester: "Semester 1" },
  { subject: "English", grade: "B", semester: "Semester 1" },
];

const UserDashboard = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to server/Google Drive
      // Here we're just creating a local object URL for demonstration
      const imageUrl = URL.createObjectURL(file);
      updateUserProfile({ profileImage: imageUrl });
    }
  };
  
  return (
    <div className="min-h-screen bg-secondary pb-16 animate-fade-in">
      <div className="max-w-md mx-auto p-4">
        <header className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-bold text-foreground">User Dashboard</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>
        
        {/* Profile Card */}
        <Card className="neu-card mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-primary/20">
                <AvatarImage src={user?.profileImage} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full neu-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 text-primary" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              {user?.additionalInfo?.class && (
                <p className="text-sm text-muted-foreground">{user.additionalInfo.class}</p>
              )}
              {user?.additionalInfo?.enrollmentDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Enrolled: {new Date(user.additionalInfo.enrollmentDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Card>
        
        <h2 className="text-xl font-semibold mb-4">Your Grades</h2>
        
        {/* Grades Cards */}
        <div className="space-y-4">
          {mockGrades.map((item, index) => (
            <Card key={index} className="neu-card">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.subject}</h3>
                  <p className="text-sm text-muted-foreground">{item.semester}</p>
                </div>
                <div className="h-12 w-12 rounded-full flex items-center justify-center neu-button bg-secondary">
                  <span className="text-lg font-bold text-primary">{item.grade}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <NavBar />
    </div>
  );
};

export default UserDashboard;

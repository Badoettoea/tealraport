
import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Upload, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";

interface GradeData {
  id: string;
  student: string;
  subject: string;
  grade: string | number;
  semester: string;
}

// Mock grades data - in a real app would be fetched from Google Sheets
const initialGrades: GradeData[] = [
  { id: "1", student: "John Doe", subject: "Mathematics", grade: "A", semester: "Semester 1" },
  { id: "2", student: "Jane Smith", subject: "Physics", grade: "B+", semester: "Semester 1" },
  { id: "3", student: "Mike Johnson", subject: "Chemistry", grade: "A-", semester: "Semester 1" },
  { id: "4", student: "Sarah Wilson", subject: "Biology", grade: 85, semester: "Semester 1" },
  { id: "5", student: "Alex Brown", subject: "English", grade: "B", semester: "Semester 1" },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [grades, setGrades] = useState<GradeData[]>(initialGrades);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, this would send the file to Google Apps Script to be processed
    // For this demo, we'll just show a success message
    toast.success("File uploaded successfully! Data would be processed on the server.");
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const toggleEdit = (id: string) => {
    setEditing(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const updateGrade = (id: string, field: keyof GradeData, value: string | number) => {
    setGrades(grades.map(grade => 
      grade.id === id ? { ...grade, [field]: value } : grade
    ));
  };
  
  const addNewRow = () => {
    const newId = `new-${Date.now()}`;
    const newGrade: GradeData = {
      id: newId,
      student: "",
      subject: "",
      grade: "",
      semester: "Semester 1",
    };
    
    setGrades([...grades, newGrade]);
    setEditing({ ...editing, [newId]: true });
  };
  
  const deleteRow = (id: string) => {
    setGrades(grades.filter(grade => grade.id !== id));
    toast.info("Row deleted");
  };
  
  const saveChanges = () => {
    // In a real app, this would sync the data back to Google Sheets
    toast.success("All changes saved successfully!");
    setEditing({});
  };
  
  return (
    <div className="min-h-screen bg-secondary pb-16 animate-fade-in">
      <div className="max-w-4xl mx-auto p-4">
        <header className="flex justify-between items-center my-4">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            className="text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>
        
        <Card className="neu-card mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Upload Grades Sheet</h2>
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                Upload Excel or CSV file with student grades
              </p>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx,.csv"
                className="hidden"
                id="file-upload"
              />
              <Button 
                className="neu-button flex-1 md:flex-none"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> 
                Select File
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="neu-card overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Grades Data</h2>
            <div className="flex gap-2">
              <Button 
                className="neu-button" 
                onClick={addNewRow}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Row
              </Button>
              <Button 
                className="neu-button bg-primary text-primary-foreground"
                onClick={saveChanges}
              >
                <Save className="mr-2 h-4 w-4" /> Save All
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>
                      {editing[grade.id] ? (
                        <Input 
                          value={grade.student} 
                          onChange={(e) => updateGrade(grade.id, "student", e.target.value)}
                        />
                      ) : (
                        grade.student
                      )}
                    </TableCell>
                    <TableCell>
                      {editing[grade.id] ? (
                        <Input 
                          value={grade.subject} 
                          onChange={(e) => updateGrade(grade.id, "subject", e.target.value)}
                        />
                      ) : (
                        grade.subject
                      )}
                    </TableCell>
                    <TableCell>
                      {editing[grade.id] ? (
                        <Input 
                          value={grade.grade.toString()} 
                          onChange={(e) => updateGrade(grade.id, "grade", e.target.value)}
                        />
                      ) : (
                        grade.grade
                      )}
                    </TableCell>
                    <TableCell>
                      {editing[grade.id] ? (
                        <Input 
                          value={grade.semester} 
                          onChange={(e) => updateGrade(grade.id, "semester", e.target.value)}
                        />
                      ) : (
                        grade.semester
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleEdit(grade.id)}
                        >
                          {editing[grade.id] ? "Done" : "Edit"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteRow(grade.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      
      {/* Bottom Navigation */}
      <NavBar />
    </div>
  );
};

export default AdminDashboard;

/**
 * Recruiter Reports/Student View Page
 * Accessibility: Card-based layout, keyboard navigation
 * Features: Read-only student profiles, filtering, interview requests
 */

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Download, Mail, Eye, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  gpa: number;
  semester: number;
  skills: string[];
  projects: Array<{ title: string; description: string }>;
  preferredRoles: string[];
  preferredLocations: string[];
}

const RecruiterReports = () => {
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [interviewRequest, setInterviewRequest] = useState({
    studentId: "",
    message: "",
    date: "",
    time: "",
  });

  // Filters
  const [filters, setFilters] = useState({
    department: "all",
    minGpa: "",
    search: "",
    skills: "",
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
        const res = await axios.get(`${baseUrl}/students/verified`);
        setStudents(res.data.students || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    if (filters.department !== "all" && student.department !== filters.department)
      return false;
    if (filters.minGpa && student.gpa < parseFloat(filters.minGpa)) return false;
    if (
      filters.search &&
      !student.name.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    if (
      filters.skills &&
      !student.skills.some((skill) =>
        skill.toLowerCase().includes(filters.skills.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const handleRequestInterview = () => {
    if (!interviewRequest.date || !interviewRequest.time) {
      toast({
        title: "Missing Information",
        description: "Please provide interview date and time.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Interview Request Sent",
      description: "The student will be notified about your request.",
    });

    setInterviewRequest({ studentId: "", message: "", date: "", time: "" });
    setSelectedStudent(null);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Student list will be downloaded shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="recruiter" userName="Recruiter" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Profiles</h1>
          <p className="text-muted-foreground">
            Browse verified student profiles and request interviews
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div>
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-sm text-muted-foreground">Available Profiles</p>
            </div>
          </Card>
          <Card className="p-4">
            <div>
              <p className="text-2xl font-bold">
                {students.reduce((sum, s) => sum + s.gpa, 0) / students.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Average GPA</p>
            </div>
          </Card>
          <Card className="p-4">
            <div>
              <p className="text-2xl font-bold">
                {new Set(students.flatMap((s) => s.department)).size}
              </p>
              <p className="text-sm text-muted-foreground">Departments</p>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Filtered List
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="search" className="text-sm">
                  Search Name
                </Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Student name..."
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="department" className="text-sm">
                  Department
                </Label>
                <Select
                  value={filters.department}
                  onValueChange={(value) =>
                    setFilters({ ...filters, department: value })
                  }
                >
                  <SelectTrigger id="department" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="CSE">Computer Science</SelectItem>
                    <SelectItem value="ECE">Electronics</SelectItem>
                    <SelectItem value="EEE">Electrical</SelectItem>
                    <SelectItem value="MECH">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minGpa" className="text-sm">
                  Min GPA
                </Label>
                <Input
                  id="minGpa"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 7.0"
                  className="mt-1"
                  value={filters.minGpa}
                  onChange={(e) => setFilters({ ...filters, minGpa: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="skills" className="text-sm">
                  Required Skills
                </Label>
                <Input
                  id="skills"
                  placeholder="e.g., React"
                  className="mt-1"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Student Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="p-6 hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-3">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="text-lg font-semibold">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="secondary">{student.department}</Badge>
                    <Badge variant="outline">GPA: {student.gpa}</Badge>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Top Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{student.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Student Profile</DialogTitle>
                        <DialogDescription>
                          Complete profile information for {student.name}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedStudent && (
                        <div className="space-y-6">
                          <div className="text-center pb-6 border-b">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-3">
                              {selectedStudent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <h3 className="text-xl font-semibold mb-1">
                              {selectedStudent.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {selectedStudent.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {selectedStudent.phone}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Academic Info</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Department:</span>
                                <p className="font-medium">
                                  {selectedStudent.department}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">CGPA:</span>
                                <p className="font-medium">{selectedStudent.gpa}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Semester:</span>
                                <p className="font-medium">{selectedStudent.semester}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedStudent.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {selectedStudent.projects.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Projects</h4>
                              <div className="space-y-3">
                                {selectedStudent.projects.map((project, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-muted/30 rounded-lg"
                                  >
                                    <h5 className="font-medium">{project.title}</h5>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {project.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold mb-2">Career Preferences</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Preferred Roles:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedStudent.preferredRoles.map((role) => (
                                    <Badge key={role} variant="outline">
                                      {role}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Preferred Locations:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedStudent.preferredLocations.map(
                                    (location) => (
                                      <Badge key={location} variant="outline">
                                        {location}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() =>
                          setInterviewRequest({ ...interviewRequest, studentId: student.id })
                        }
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Request Interview
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Interview</DialogTitle>
                        <DialogDescription>
                          Send an interview request to {student.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Interview Date *</Label>
                            <Input
                              id="date"
                              type="date"
                              value={interviewRequest.date}
                              onChange={(e) =>
                                setInterviewRequest({
                                  ...interviewRequest,
                                  date: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Interview Time *</Label>
                            <Input
                              id="time"
                              type="time"
                              value={interviewRequest.time}
                              onChange={(e) =>
                                setInterviewRequest({
                                  ...interviewRequest,
                                  time: e.target.value,
                                })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Additional details about the interview..."
                            value={interviewRequest.message}
                            onChange={(e) =>
                              setInterviewRequest({
                                ...interviewRequest,
                                message: e.target.value,
                              })
                            }
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                        <Button onClick={handleRequestInterview} className="w-full">
                          Send Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters to see more profiles
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecruiterReports;

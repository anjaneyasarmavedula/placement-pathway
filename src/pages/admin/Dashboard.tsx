/**
 * Admin/TPO Dashboard
 * Accessibility: Table keyboard navigation, ARIA labels
 * Features: Student filtering, verification, export reports
 */

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { SkeletonTable } from "@/components/ui/skeleton-loader";
import {
  Users,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  gpa: number;
  semester: number;
  skills: string[];
  verified: boolean;
  placementStatus: "unplaced" | "placed" | "in-process";
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    department: "all",
    minGpa: "",
    placementStatus: "all",
    verifiedOnly: false,
    search: "",
    skills: [] as string[],
  });

  // Mock student data
  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@jntugv.edu.in",
      department: "CSE",
      gpa: 8.5,
      semester: 7,
      skills: ["React", "Node.js", "Python"],
      verified: true,
      placementStatus: "placed",
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@jntugv.edu.in",
      department: "ECE",
      gpa: 8.8,
      semester: 7,
      skills: ["VLSI", "Python", "MATLAB"],
      verified: false,
      placementStatus: "unplaced",
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit@jntugv.edu.in",
      department: "CSE",
      gpa: 9.1,
      semester: 8,
      skills: ["Java", "Spring Boot", "AWS"],
      verified: true,
      placementStatus: "in-process",
    },
  ]);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredStudents = students.filter((student) => {
    if (filters.department !== "all" && student.department !== filters.department)
      return false;
    if (filters.minGpa && student.gpa < parseFloat(filters.minGpa)) return false;
    if (
      filters.placementStatus !== "all" &&
      student.placementStatus !== filters.placementStatus
    )
      return false;
    if (filters.verifiedOnly && !student.verified) return false;
    if (
      filters.search &&
      !student.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !student.email.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleVerify = (studentId: string) => {
    toast({
      title: "Student Verified",
      description: "Profile has been verified successfully.",
    });
  };

  const handleSendToRecruiters = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select students to send to recruiters.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Profiles Sent",
      description: `${selectedStudents.length} profiles sent to recruiters.`,
    });
    setSelectedStudents([]);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Report will be downloaded shortly.",
    });
  };

  const getPlacementBadge = (status: string) => {
    switch (status) {
      case "placed":
        return (
          <Badge className="bg-success/10 text-success border-success/20">Placed</Badge>
        );
      case "in-process":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            In Process
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground">Unplaced</Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="admin" userName="TPO Admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student Management</h1>
          <p className="text-muted-foreground">
            Manage student profiles, verify records, and coordinate with recruiters
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-success/10 p-2">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.filter((s) => s.verified).length}
                </p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-success/10 p-2">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.filter((s) => s.placementStatus === "placed").length}
                </p>
                <p className="text-xs text-muted-foreground">Placed</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-warning/10 p-2">
                <Users className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {students.filter((s) => s.placementStatus === "unplaced").length}
                </p>
                <p className="text-xs text-muted-foreground">Unplaced</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              <Button
                onClick={handleSendToRecruiters}
                disabled={selectedStudents.length === 0}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to Recruiters ({selectedStudents.length})
              </Button>
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="search" className="text-sm">
                  Search
                </Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Name or email..."
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
                <Label htmlFor="placementStatus" className="text-sm">
                  Placement Status
                </Label>
                <Select
                  value={filters.placementStatus}
                  onValueChange={(value) =>
                    setFilters({ ...filters, placementStatus: value })
                  }
                >
                  <SelectTrigger id="placementStatus" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unplaced">Unplaced</SelectItem>
                    <SelectItem value="in-process">In Process</SelectItem>
                    <SelectItem value="placed">Placed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Checkbox
                  id="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, verifiedOnly: checked as boolean })
                  }
                />
                <Label htmlFor="verifiedOnly" className="text-sm cursor-pointer">
                  Verified Only
                </Label>
              </div>
            </div>
          )}

          {/* Students Table */}
          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-medium">
                      <Checkbox
                        checked={selectedStudents.length === filteredStudents.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStudents(filteredStudents.map((s) => s.id));
                          } else {
                            setSelectedStudents([]);
                          }
                        }}
                        aria-label="Select all students"
                      />
                    </th>
                    <th className="text-left p-3 text-sm font-medium">Student</th>
                    <th className="text-left p-3 text-sm font-medium">Department</th>
                    <th className="text-left p-3 text-sm font-medium">GPA</th>
                    <th className="text-left p-3 text-sm font-medium">Skills</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(
                                selectedStudents.filter((id) => id !== student.id)
                              );
                            }
                          }}
                          aria-label={`Select ${student.name}`}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">{student.department}</Badge>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold">{student.gpa}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {student.skills.slice(0, 2).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {student.skills.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{student.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          {getPlacementBadge(student.placementStatus)}
                          {student.verified ? (
                            <Badge className="bg-success/10 text-success border-success/20 w-fit">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="w-fit">
                              <XCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!student.verified && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleVerify(student.id)}
                              title="Verify Student"
                            >
                              <CheckCircle className="w-4 h-4 text-success" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

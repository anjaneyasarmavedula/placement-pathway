/**
 * Student Dashboard
 * Accessibility: Semantic sections, ARIA labels, keyboard navigation
 * Features: Profile summary, quick actions, application timeline
 */

import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  FileText,
  Briefcase,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
        // Fetch student profile
        const profileRes = await axios.get(`${baseUrl}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentProfile(profileRes.data.student);
        // Fetch opportunities for eligible student
        const oppRes = await axios.get(`${baseUrl}/opportunities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOpportunities(oppRes.data.opportunities || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "shortlisted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "shortlisted":
        return "bg-success/10 text-success border-success/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-lg">Loading dashboard...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-destructive">{error}</span>
      </div>
    );
  }
  if (!studentProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName={studentProfile.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {studentProfile.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Track your applications and manage your profile
          </p>
        </div>

        {/* Profile Verification Alert */}
        {!studentProfile.isverified && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-warning">Profile Not Verified</h3>
              <p className="text-sm text-foreground mt-1">
                Your profile is pending TPO verification. Complete your profile to speed
                up the process.
              </p>
            </div>
          </div>
        )}
        {studentProfile.isverified && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-success">Profile Verified</h3>
              <p className="text-sm text-foreground mt-1">
                Your profile has been verified by the TPO. You can now apply to all opportunities.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-4">
                  {studentProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  {studentProfile.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {studentProfile.email}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Badge variant="secondary">{studentProfile.department}</Badge>
                  <Badge variant="outline">
                    GPA: {studentProfile.gpa}
                  </Badge>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-semibold">{studentProfile.profileComplete}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                    style={{ width: `${studentProfile.profileComplete}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Complete your profile to increase visibility
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/student/profile">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/student/resume">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resume
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/student/opportunities">
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Opportunities
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Opportunities List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Available Opportunities</h3>
              </div>
              {opportunities.length > 0 ? (
                <div className="space-y-4">
                  {opportunities.map((opp) => (
                    <div
                      key={opp._id}
                      className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {opp.company?.name?.charAt(0) || opp.company?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {opp.company?.name || opp.company}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {opp.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Location: {opp.location || "-"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h4 className="font-semibold mb-2">No Opportunities Available</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    There are currently no eligible opportunities for you.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

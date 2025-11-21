import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, UserCheck, UserX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    deadline: "",
    minGpa: "",
    department: "",
    skills: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
        const appsRes = await axios.get(`${baseUrl}/company/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(appsRes.data.applications || []);
        const jobsRes = await axios.get(`${baseUrl}/company/opportunities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsRes.data.opportunities || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openJobModal = (job: any = null) => {
    setEditingJob(job);
    setJobForm(job ? {
      title: job.title,
      description: job.description,
      location: job.location,
      deadline: job.deadline ? job.deadline.slice(0, 10) : "",
      minGpa: job.minGpa || "",
      department: job.department || "",
      skills: job.skills ? job.skills.join(", ") : "",
    } : {
      title: "",
      description: "",
      location: "",
      deadline: "",
      minGpa: "",
      department: "",
      skills: "",
    });
    setJobModalOpen(true);
  };

  const handleJobFormChange = (e: any) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    try {
      if (editingJob) {
        await axios.put(`${baseUrl}/company/opportunities/${editingJob._id}`, {
          ...jobForm,
          minGpa: jobForm.minGpa ? Number(jobForm.minGpa) : undefined,
          skills: jobForm.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
        }, { headers: { Authorization: `Bearer ${token}` } });
        toast({ title: "Job updated" });
      } else {
        await axios.post(`${baseUrl}/company/opportunities`, {
          ...jobForm,
          minGpa: jobForm.minGpa ? Number(jobForm.minGpa) : undefined,
          skills: jobForm.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
        }, { headers: { Authorization: `Bearer ${token}` } });
        toast({ title: "Job posted" });
      }
      setJobModalOpen(false);
      setEditingJob(null);
      // Refresh jobs
      const jobsRes = await axios.get(`${baseUrl}/company/opportunities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobsRes.data.opportunities || []);
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to save job", variant: "destructive" });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    try {
      await axios.delete(`${baseUrl}/company/opportunities/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs => jobs.filter(j => j._id !== jobId));
      toast({ title: "Job deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete job", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><span>Loading dashboard...</span></div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><span className="text-destructive">{error}</span></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Job Postings</h2>
            <Button onClick={() => openJobModal()} variant="default">Post New Job</Button>
          </div>
          {jobs.length === 0 ? (
            <div className="text-muted-foreground">No jobs posted yet.</div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job._id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-semibold text-lg">{job.title}</div>
                    <div className="text-sm text-muted-foreground mb-1">{job.location} | Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}</div>
                    <div className="text-xs text-muted-foreground mb-1">Role: {job.role || "-"} | Package: {job.package || "-"} | Company: {job.companyName || job.company?.name || "-"}</div>
                    <div className="text-xs text-muted-foreground mb-1">Min GPA: {job.minGpa || "-"} | Dept: {job.department || "-"} | Skills: {job.skills?.join(", ") || "-"}</div>
                    <div className="text-sm mb-1">{job.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openJobModal(job)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteJob(job._id)}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
        <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingJob ? "Edit Job" : "Post New Job"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleJobSubmit} className="space-y-4">
              <Input name="title" placeholder="Job Title" value={jobForm.title} onChange={handleJobFormChange} required />
              <Input name="role" placeholder="Role (e.g., SDE, Analyst)" value={jobForm.role || ""} onChange={handleJobFormChange} required />
              <Input name="package" placeholder="Package (e.g., 8 LPA)" value={jobForm.package || ""} onChange={handleJobFormChange} required />
              <Input name="companyName" placeholder="Company Name" value={jobForm.companyName || ""} onChange={handleJobFormChange} required />
              <Textarea name="description" placeholder="Description" value={jobForm.description} onChange={handleJobFormChange} />
              <Input name="location" placeholder="Location" value={jobForm.location} onChange={handleJobFormChange} />
              <Input name="deadline" type="date" placeholder="Deadline" value={jobForm.deadline} onChange={handleJobFormChange} />
              <Input name="minGpa" type="number" step="0.1" placeholder="Min GPA" value={jobForm.minGpa} onChange={handleJobFormChange} />
              <Select value={jobForm.department} onValueChange={val => setJobForm(f => ({ ...f, department: val }))}>
                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="EEE">EEE</SelectItem>
                  <SelectItem value="MECH">MECH</SelectItem>
                  <SelectItem value="CIVIL">CIVIL</SelectItem>
                </SelectContent>
              </Select>
              <Input name="skills" placeholder="Skills (comma separated)" value={jobForm.skills} onChange={handleJobFormChange} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setJobModalOpen(false)}>Cancel</Button>
                <Button type="submit">{editingJob ? "Update" : "Post"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Card className="p-6 mb-8 mt-8">
          <h2 className="text-xl font-semibold mb-4">Applications Received</h2>
          {applications.length === 0 ? (
            <div className="text-muted-foreground">No applications yet.</div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{app.position}</span>
                    <span className="text-muted-foreground text-sm">at {app.company?.name || "Company"}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center text-sm mb-1">
                    <span>Student: <b>{app.student?.name}</b> ({app.student?.email})</span>
                    <span>Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-"}</span>
                    <span>Status: <b>{app.status}</b></span>
                  </div>
                  {app.additionalInfo && (
                    <div className="text-xs text-muted-foreground mb-1">Info: {app.additionalInfo}</div>
                  )}
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">View Resume</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

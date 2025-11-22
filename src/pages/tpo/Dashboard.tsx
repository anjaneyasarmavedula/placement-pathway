import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TPONavbar from "@/components/layout/TPONavbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";

const TPODashboard = () => {
  const [counts, setCounts] = useState({ students: 0, companies: 0, opportunities: 0 });
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    companyName: "",
    description: "",
    location: "",
    deadline: "",
    minGpa: "",
    minGpa: "",
    skills: "",
    role: "",
    package: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("tpoToken");
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
      const [studentsRes, companiesRes, oppsRes] = await Promise.all([
        axios.get(`${baseUrl}/tpo/students`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${baseUrl}/tpo/companies`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${baseUrl}/tpo/opportunities`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCounts({
        students: studentsRes.data.students?.length || 0,
        companies: companiesRes.data.companies?.length || 0,
        opportunities: oppsRes.data.opportunities?.length || 0,
      });
      setOpportunities(oppsRes.data.opportunities || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleJobFormChange = (e: any) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("tpoToken");
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    try {
      await axios.post(`${baseUrl}/tpo/opportunities`, {
        ...jobForm,
        minGpa: jobForm.minGpa ? Number(jobForm.minGpa) : undefined,
        skills: jobForm.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast({ title: "Opportunity created successfully" });
      setJobModalOpen(false);
      setJobForm({
        title: "",
        companyName: "",
        description: "",
        location: "",
        deadline: "",
        minGpa: "",
        minGpa: "",
        skills: "",
        role: "",
        package: "",
      });
      fetchData(); // Refresh data
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to create opportunity", variant: "destructive" });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this opportunity? This will also delete all applications associated with it.")) return;

    const token = localStorage.getItem("tpoToken");
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    try {
      await axios.delete(`${baseUrl}/tpo/opportunities/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: "Opportunity deleted" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete opportunity", variant: "destructive" });
    }
  };

  const handleExportExcel = async (jobId: string, jobTitle: string) => {
    const token = localStorage.getItem("tpoToken");
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
    try {
      // We need to fetch applications for this specific job. 
      // Since there isn't a direct endpoint for TPO to get applications for a specific job, 
      // we might need to fetch all applications or add an endpoint.
      // However, based on current backend, we can't easily get applications for a specific job as TPO without a new endpoint.
      // Let's assume we need to add an endpoint or filter from a general list.
      // Wait, the requirement says "excel sheet download button for every opportunity".
      // I missed adding a route to get applications for a job for TPO.
      // Let's try to use a new endpoint I should have added or add it now.
      // Actually, I can't add it now without going back to backend.
      // Let's check if I can use existing endpoints.
      // TPO doesn't have an endpoint to get applications.
      // I will add a quick endpoint in the backend in the next step if needed, but for now let's assume I'll add it.
      // Let's just put the frontend logic assuming the endpoint exists: GET /tpo/opportunities/:id/applications

      // Wait, I can't assume. I should have added it.
      // Let's pause frontend and go back to backend to add `GET /tpo/opportunities/:id/applications`.
      // OR, I can fetch ALL students and filter? No, applications are separate.

      // I will implement the button but it will fail until I add the route.
      // Let's add the route in the next step.

      const res = await axios.get(`${baseUrl}/tpo/opportunities/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const applications = res.data.applications || [];

      if (applications.length === 0) {
        toast({ title: "No applications to export", variant: "destructive" });
        return;
      }

      const dataToExport = applications.map((app: any) => ({
        "Student Name": app.student?.name || "N/A",
        "Roll Number": app.student?.rollNumber || "N/A",
        "Branch": app.student?.department || "N/A",
        "CGPA": app.student?.gpa || "N/A",
        "Job Title": jobTitle,
        "Application Status": app.status || "N/A",
        "Applied Date": app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
      XLSX.writeFile(workbook, `${jobTitle}_applications.xlsx`);
      toast({ title: "Exported to Excel successfully" });

    } catch (err: any) {
      toast({ title: "Error exporting data", description: "Could not fetch applications for this job", variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-background text-destructive">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <TPONavbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">TPO Dashboard</h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/tpo/verify-students")}>Verify Students</Button>
            <Button onClick={() => setJobModalOpen(true)}>Post New Opportunity</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold">{counts.students}</div>
            <div className="text-muted-foreground mt-2">Students</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold">{counts.companies}</div>
            <div className="text-muted-foreground mt-2">Companies</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold">{counts.opportunities}</div>
            <div className="text-muted-foreground mt-2">Opportunities</div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Opportunities</h2>
          {opportunities.length === 0 ? (
            <div className="text-muted-foreground">No opportunities found.</div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((job) => (
                <Card key={job._id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-semibold text-lg">{job.title}</div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {job.companyName || job.company?.name || "Unknown Company"} | {job.location} | Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Role: {job.role || "-"} | Package: {job.package || "-"} | Posted By: {job.postedBy === 'tpo' ? 'TPO' : 'Company'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleExportExcel(job._id, job.title)} className="flex items-center gap-1">
                      <FileSpreadsheet className="w-4 h-4" /> Export
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteJob(job._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Dialog open={jobModalOpen} onOpenChange={setJobModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Post New Opportunity</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleJobSubmit} className="space-y-4">
              <Input name="title" placeholder="Job Title" value={jobForm.title} onChange={handleJobFormChange} required />
              <Input name="companyName" placeholder="Company Name" value={jobForm.companyName} onChange={handleJobFormChange} required />
              <Input name="role" placeholder="Role (e.g., SDE, Analyst)" value={jobForm.role} onChange={handleJobFormChange} required />
              <Input name="package" placeholder="Package (e.g., 8 LPA)" value={jobForm.package} onChange={handleJobFormChange} required />
              <Textarea name="description" placeholder="Description" value={jobForm.description} onChange={handleJobFormChange} />
              <Input name="location" placeholder="Location" value={jobForm.location} onChange={handleJobFormChange} />
              <Input name="deadline" type="date" placeholder="Deadline" value={jobForm.deadline} onChange={handleJobFormChange} />
              <Input name="minGpa" type="number" step="0.1" placeholder="Min GPA" value={jobForm.minGpa} onChange={handleJobFormChange} />
              <Input name="skills" placeholder="Skills (comma separated)" value={jobForm.skills} onChange={handleJobFormChange} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setJobModalOpen(false)}>Cancel</Button>
                <Button type="submit">Post</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TPODashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TPONavbar from "@/components/layout/TPONavbar";

const TPODashboard = () => {
  const [counts, setCounts] = useState({ students: 0, companies: 0, opportunities: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
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
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-background text-destructive">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <TPONavbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">TPO Dashboard</h1>
        <div className="flex gap-4 mb-8">
          <Button onClick={() => navigate("/tpo/verify-students")}>Verify Students</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default TPODashboard;

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TPONavbar from "@/components/layout/TPONavbar";

const VerifyStudents = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("tpoToken");
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
        const res = await axios.get(`${baseUrl}/tpo/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data.students || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      const token = localStorage.getItem("tpoToken");
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
      await axios.post(`${baseUrl}/tpo/verify-student/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students => students.map(s => s._id === id ? { ...s, isverified: true } : s));
      toast({ title: "Student verified" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to verify student", variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-background text-destructive">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <TPONavbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Verify Student Accounts</h1>
        <Card className="p-6">
          {students.length === 0 ? (
            <div>No students found.</div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student._id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                  <div>
                    <div className="font-semibold">{student.name}</div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                    <div className="text-xs">Verified: {student.isverified ? "Yes" : "No"}</div>
                  </div>
                  {!student.isverified && (
                    <Button size="sm" onClick={() => handleVerify(student._id)}>Verify</Button>
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

export default VerifyStudents;

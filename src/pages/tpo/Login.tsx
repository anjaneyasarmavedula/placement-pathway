import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TPONavbar from "@/components/layout/TPONavbar";

const TPLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
      const res = await axios.post(`${baseUrl}/tpo/login`, { email, password });
      localStorage.setItem("tpoToken", res.data.token);
    //   navigate("/tpo/verify-students");
    navigate("/tpo/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <TPONavbar /> */}
      <div className="flex-1 flex items-center justify-center bg-background">
        <Card className="p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">TPO Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TPLogin;

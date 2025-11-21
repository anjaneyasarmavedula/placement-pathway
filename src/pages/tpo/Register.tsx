import { useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TPONavbar from "@/components/layout/TPONavbar";

const TPORegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
      await axios.post(`${baseUrl}/tpo/register`, { name, email, password });
      setSuccess("TPO registered successfully. You can now login.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TPONavbar />
      <div className="flex-1 flex items-center justify-center bg-background">
        <Card className="p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">TPO Register</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
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
            {success && <div className="text-success text-sm">{success}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TPORegister;

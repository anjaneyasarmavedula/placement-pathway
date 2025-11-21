import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { GraduationCap, Mail, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormData = {
  email: string;
  password: string;
  role: "student" | "recruiter" | "";
};

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (key: keyof FormData | string) => {
    setErrors((prev) => {
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
      // backend expects `type` field to determine collection
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        type: formData.role, // 'student' or 'recruiter'
      };

      const response = await axios.post(`${baseUrl}/login`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      // expected shape: { token, user }
      const { token, user } = response.data;

      // store token (consider httpOnly cookie for production)
      if (token) {
        localStorage.setItem("token", token);
      }
      if (user?.role) {
        localStorage.setItem("role", user.role);
      } else {
        localStorage.setItem("role", formData.role);
      }

      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });

      // decide redirect: prefer server-provided role
      const role = user?.role || formData.role;
      if (role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err: any) {
      // Prefer backend message
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";

      // If invalid credentials map to a field-level error
      if (err?.response?.status === 401) {
        setErrors({ password: "Invalid email or password" });
      }

      toast({
        title: "Login Failed",
        description: serverMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your placement portal account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@jntugv.edu.in"
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) clearError("email");
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="text-destructive text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`pl-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) clearError("password");
                  }}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  className="text-destructive text-sm mt-1 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Role Select */}
            <div>
              <Label htmlFor="role" className="text-sm font-medium">
                Register As *
              </Label>

              <div className="mt-1">
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, role: value as FormData["role"] }));
                    if (errors.role) clearError("role");
                  }}
                >
                  <SelectTrigger
                    id="role"
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? "role-error" : undefined}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="recruiter">Company / Recruiter</SelectItem>
                  </SelectContent>
                </Select>

                {errors.role && (
                  <p
                    id="role-error"
                    className="text-destructive text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.role}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">Are you a TPO? </span>
            <Link to="/tpo/login" className="text-primary underline text-sm">TPO Login</Link>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;

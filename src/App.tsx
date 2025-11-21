import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import RecruiterReports from "./pages/recruiter/Reports";
import NotFound from "./pages/NotFound";
import Opportunities from "./pages/student/Opportunities";
import Logout from "./pages/Logout";
import TPLogin from "./pages/tpo/Login";
import VerifyStudents from "./pages/tpo/VerifyStudents";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import TPORegister from "./pages/tpo/Register";
import TPODashboard from "./pages/tpo/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/recruiter/reports" element={<RecruiterReports />} />
          <Route path="/student/opportunities" element={<Opportunities />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/tpo/login" element={<TPLogin />} />
          <Route path="/tpo/verify-students" element={<VerifyStudents />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/tpo/register" element={<TPORegister />} />
          <Route path="/tpo/dashboard" element={<TPODashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

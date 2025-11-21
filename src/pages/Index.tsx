import { Navigate } from "react-router-dom";
import Landing from "./Landing";

const Index = () => {
  // Check if user is logged in
  // const isLoggedIn = false; // Replace with actual auth check
  // const userRole = "student"; // Replace with actual role from auth

  // Redirect based on auth status
  // if (isLoggedIn) {
  //   if (userRole === "student") return <Navigate to="/student/dashboard" />;
  //   if (userRole === "admin") return <Navigate to="/admin/dashboard" />;
  //   if (userRole === "recruiter") return <Navigate to="/recruiter/reports" />;
  // }

  return <Landing />;
};

export default Index;

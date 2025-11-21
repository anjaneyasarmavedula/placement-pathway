import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove token and any user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("studentProfileDraft");
    // Add any other cleanup if needed
    // Redirect to login or landing page
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <span className="text-lg">Logging out...</span>
    </div>
  );
};

export default Logout;

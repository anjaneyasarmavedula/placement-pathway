import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TPONavbar = () => {
  const location = useLocation();
  return (
    <nav className="w-full bg-primary text-primary-foreground py-3 px-6 flex items-center justify-between shadow">
      <div className="font-bold text-lg">TPO Panel</div>
      <div className="flex gap-4">
        <Button asChild variant={location.pathname === "/tpo/dashboard" ? "secondary" : "ghost"}>
          <Link to="/tpo/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant={location.pathname === "/tpo/verify-students" ? "secondary" : "ghost"}>
          <Link to="/tpo/verify-students">Verify Students</Link>
        </Button>
        <Button asChild variant={location.pathname === "/tpo/register" ? "secondary" : "ghost"}>
          <Link to="/tpo/register">Register TPO</Link>
        </Button>
        <Button asChild variant={location.pathname === "/tpo/login" ? "secondary" : "ghost"}>
          <Link to="/login">Logout</Link>
        </Button>
      </div>
    </nav>
  );
};

export default TPONavbar;

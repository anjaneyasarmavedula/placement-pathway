/**
 * Navbar Component
 * Accessibility: Full keyboard navigation, ARIA labels, focus states
 * Responsive: Mobile hamburger menu, desktop horizontal nav
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface NavbarProps {
  userRole?: "student" | "admin" | "recruiter" | null;
  userName?: string;
}

export const Navbar = ({ userRole, userName }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = userRole
    ? userRole === "student"
      ? [
          { path: "/student/dashboard", label: "Dashboard" },
          { path: "/student/profile", label: "Profile" },
          { path: "/student/opportunities", label: "Opportunities" },
        ]
      : userRole === "admin"
      ? [
          { path: "/admin/dashboard", label: "Dashboard" },
          { path: "/admin/students", label: "Students" },
          { path: "/admin/reports", label: "Reports" },
        ]
      : [
          { path: "/recruiter/reports", label: "Students" },
          { path: "/recruiter/requests", label: "Requests" },
        ]
    : [
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity"
            aria-label="JNTU GV Placement Portal Home"
          >
            <GraduationCap className="w-8 h-8" />
            <span className="hidden sm:inline">JNTU GV Placements</span>
            <span className="sm:hidden">JNTU GV</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="ml-2"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* User Actions */}
            {userRole ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {userName || "User"}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/logout">Logout</Link>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {userRole ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {userName || "User"}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/logout">Logout</Link>
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  asChild
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

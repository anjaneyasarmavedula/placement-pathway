/**
 * Landing Page
 * Accessibility: Semantic HTML, proper heading hierarchy, keyboard navigation
 * Responsive: Mobile-first design with breakpoints
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Navbar } from "@/components/layout/Navbar";
import {
  Users,
  TrendingUp,
  Building2,
  ArrowRight,
  CheckCircle,
  Target,
  Award,
  Briefcase,
} from "lucide-react";

const Landing = () => {
  const stats = [
    {
      title: "Students Placed",
      value: "850+",
      icon: Users,
      trend: { value: 15, isPositive: true },
      description: "This academic year",
    },
    {
      title: "Average CTC",
      value: "₹6.5 LPA",
      icon: TrendingUp,
      trend: { value: 12, isPositive: true },
      description: "Across all branches",
    },
    {
      title: "Active Recruiters",
      value: "120+",
      icon: Building2,
      description: "Top companies partnered",
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Comprehensive Profile Management",
      description:
        "Create detailed profiles with academics, skills, projects, and certifications",
    },
    {
      icon: Award,
      title: "Verified by TPO",
      description:
        "Admin verification ensures authentic and quality candidate profiles",
    },
    {
      icon: Briefcase,
      title: "Direct Recruiter Access",
      description: "Companies can view filtered, verified student profiles instantly",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              JNTU GV Placement{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Support System
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Empowering students to showcase their potential and connecting them with
              top recruiters through a streamlined, verified placement process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Placement Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive system designed to streamline campus placements for
              students, TPO, and recruiters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Register", desc: "Create your student account" },
              {
                step: "2",
                title: "Build Profile",
                desc: "Add academics, skills, and projects",
              },
              {
                step: "3",
                title: "Get Verified",
                desc: "TPO reviews and approves your profile",
              },
              {
                step: "4",
                title: "Get Placed",
                desc: "Recruiters view and contact you",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of students who have successfully landed their dream jobs
            through our platform.
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link to="/signup">
              Create Your Profile Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                JNTU GV, Vizianagaram
                <br />
                Email: placements@jntugv.edu.in
                <br />
                Phone: +91 1234567890
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">For Recruiters</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Interested in hiring our talented students?
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/recruiter/signup">Register as Recruiter</Link>
              </Button>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 JNTU GV Placement Cell. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

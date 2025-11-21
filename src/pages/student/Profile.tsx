/**
 * Student Profile Form
 * Accessibility: Full form labels, ARIA attributes, keyboard navigation
 * Features: Auto-save draft, preview mode, comprehensive profile fields
 */

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

const StudentProfile = () => {
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    department: "",
    rollNumber: "",
    semester: "",

    // Academic
    gpa: "",
    tenthPercent: "",
    twelfthPercent: "",
    activeBacklogs: "",

    // Skills & Preferences
    skills: [] as string[],
    preferredRoles: [] as string[],
    preferredLocations: [] as string[],

    // Resume
    resumeFile: null as File | null,
    resumeFileName: "",
  });

  const [projects, setProjects] = useState<Project[]>([
    { id: "1", title: "", description: "", link: "" },
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { id: "1", name: "", issuer: "", date: "" },
  ]);

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("studentProfileDraft");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData || formData);
      setProjects(parsed.projects || projects);
      setCertifications(parsed.certifications || certifications);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        "studentProfileDraft",
        JSON.stringify({ formData, projects, certifications })
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, projects, certifications]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/profile`, {
      //   ...formData,
      //   projects,
      //   certifications,
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Profile Saved",
        description: "Your profile has been updated successfully.",
      });

      localStorage.removeItem("studentProfileDraft");
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addProject = () => {
    setProjects([...projects, { id: Date.now().toString(), title: "", description: "", link: "" }]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addCertification = () => {
    setCertifications([...certifications, { id: Date.now().toString(), name: "", issuer: "", date: "" }]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar userRole="student" userName={formData.fullName} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Profile Preview</h1>
            <Button onClick={() => setIsPreview(false)} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
          </div>

          <Card className="p-8">
            {/* Preview content matching recruiter view */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-3xl font-bold mx-auto mb-4">
                {formData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold mb-1">{formData.fullName}</h2>
              <p className="text-muted-foreground">{formData.department}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formData.email} • {formData.phone}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Academic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">CGPA:</span>{" "}
                    <span className="font-medium">{formData.gpa || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Semester:</span>{" "}
                    <span className="font-medium">{formData.semester || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">10th %:</span>{" "}
                    <span className="font-medium">{formData.tenthPercent || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">12th %:</span>{" "}
                    <span className="font-medium">{formData.twelfthPercent || "N/A"}</span>
                  </div>
                </div>
              </div>

              {formData.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {projects.some((p) => p.title) && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Projects</h3>
                  <div className="space-y-4">
                    {projects
                      .filter((p) => p.title)
                      .map((project) => (
                        <div key={project.id} className="border-l-2 border-primary pl-4">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {project.description}
                          </p>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-1 inline-block"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" userName={formData.fullName} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Build Your Profile</h1>
            <p className="text-muted-foreground">
              Complete your profile to get noticed by recruiters
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsPreview(true)} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Info */}
          <TabsContent value="personal">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@jntugv.edu.in"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 1234567890"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="rollNumber">Roll Number *</Label>
                  <Input
                    id="rollNumber"
                    value={formData.rollNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNumber: e.target.value })
                    }
                    placeholder="20XX1AXXXX"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger id="department" className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">Computer Science</SelectItem>
                      <SelectItem value="ECE">Electronics</SelectItem>
                      <SelectItem value="EEE">Electrical</SelectItem>
                      <SelectItem value="MECH">Mechanical</SelectItem>
                      <SelectItem value="CIVIL">Civil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Current Semester *</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) =>
                      setFormData({ ...formData, semester: value })
                    }
                  >
                    <SelectTrigger id="semester" className="mt-1">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Academic */}
          <TabsContent value="academic">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Academic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="gpa">Current CGPA *</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    value={formData.gpa}
                    onChange={(e) =>
                      setFormData({ ...formData, gpa: e.target.value })
                    }
                    placeholder="8.50"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="activeBacklogs">Active Backlogs</Label>
                  <Input
                    id="activeBacklogs"
                    type="number"
                    value={formData.activeBacklogs}
                    onChange={(e) =>
                      setFormData({ ...formData, activeBacklogs: e.target.value })
                    }
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tenthPercent">10th Percentage *</Label>
                  <Input
                    id="tenthPercent"
                    type="number"
                    step="0.01"
                    value={formData.tenthPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, tenthPercent: e.target.value })
                    }
                    placeholder="85.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="twelfthPercent">12th Percentage *</Label>
                  <Input
                    id="twelfthPercent"
                    type="number"
                    step="0.01"
                    value={formData.twelfthPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, twelfthPercent: e.target.value })
                    }
                    placeholder="90.00"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label>Resume *</Label>
                <FileUpload
                  onFileSelect={(file) =>
                    setFormData({
                      ...formData,
                      resumeFile: file,
                      resumeFileName: file.name,
                    })
                  }
                  currentFile={formData.resumeFileName}
                  onRemove={() =>
                    setFormData({ ...formData, resumeFile: null, resumeFileName: "" })
                  }
                  className="mt-1"
                />
              </div>
            </Card>
          </TabsContent>

          {/* Experience */}
          <TabsContent value="experience">
            <div className="space-y-6">
              {/* Projects */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <Button onClick={addProject} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div
                      key={project.id}
                      className="p-4 border border-border rounded-lg relative"
                    >
                      {projects.length > 1 && (
                        <Button
                          onClick={() => removeProject(project.id)}
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`project-title-${index}`}>
                            Project Title *
                          </Label>
                          <Input
                            id={`project-title-${index}`}
                            value={project.title}
                            onChange={(e) =>
                              updateProject(project.id, "title", e.target.value)
                            }
                            placeholder="E-commerce Website"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`project-desc-${index}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`project-desc-${index}`}
                            value={project.description}
                            onChange={(e) =>
                              updateProject(project.id, "description", e.target.value)
                            }
                            placeholder="Brief description of the project..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`project-link-${index}`}>
                            Project Link
                          </Label>
                          <Input
                            id={`project-link-${index}`}
                            type="url"
                            value={project.link}
                            onChange={(e) =>
                              updateProject(project.id, "link", e.target.value)
                            }
                            placeholder="https://github.com/..."
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Certifications */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Certifications</h2>
                  <Button onClick={addCertification} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="p-4 border border-border rounded-lg relative grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      {certifications.length > 1 && (
                        <Button
                          onClick={() => removeCertification(cert.id)}
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <div>
                        <Label htmlFor={`cert-name-${index}`}>
                          Certification Name
                        </Label>
                        <Input
                          id={`cert-name-${index}`}
                          value={cert.name}
                          onChange={(e) =>
                            updateCertification(cert.id, "name", e.target.value)
                          }
                          placeholder="AWS Certified"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`cert-issuer-${index}`}>Issuer</Label>
                        <Input
                          id={`cert-issuer-${index}`}
                          value={cert.issuer}
                          onChange={(e) =>
                            updateCertification(cert.id, "issuer", e.target.value)
                          }
                          placeholder="Amazon"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`cert-date-${index}`}>Date</Label>
                        <Input
                          id={`cert-date-${index}`}
                          type="date"
                          value={cert.date}
                          onChange={(e) =>
                            updateCertification(cert.id, "date", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Career Preferences</h2>
              <div className="space-y-6">
                <div>
                  <Label>Technical Skills</Label>
                  <TagInput
                    tags={formData.skills}
                    onTagsChange={(tags) => setFormData({ ...formData, skills: tags })}
                    placeholder="Add skill (e.g., React, Python)"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Preferred Roles</Label>
                  <TagInput
                    tags={formData.preferredRoles}
                    onTagsChange={(tags) =>
                      setFormData({ ...formData, preferredRoles: tags })
                    }
                    placeholder="Add role (e.g., Software Engineer)"
                    maxTags={10}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Preferred Locations</Label>
                  <TagInput
                    tags={formData.preferredLocations}
                    onTagsChange={(tags) =>
                      setFormData({ ...formData, preferredLocations: tags })
                    }
                    placeholder="Add location (e.g., Bangalore)"
                    maxTags={10}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentProfile;

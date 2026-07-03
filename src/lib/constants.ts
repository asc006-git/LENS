export const SIDEBAR_STUDENT_LINKS = [
  { name: "Dashboard", href: "/student", icon: "LayoutDashboard" },
  { name: "Learning Sessions", href: "/student/sessions", icon: "BookOpen" },
  { name: "New Session", href: "/student/create", icon: "PlusCircle" },
  { name: "AI Mentor", href: "/student/validate", icon: "Bot" },
  { name: "Reflection Notebook", href: "/student/reflection", icon: "NotebookPen" },
  { name: "Reports", href: "/student/report", icon: "BarChart3" },
  { name: "Growth Portfolio", href: "/student/portfolio", icon: "TrendingUp" },
  { name: "Achievements", href: "/student/portfolio", icon: "Award" },
  { name: "Settings", href: "#", icon: "Settings" },
  { name: "Profile", href: "/student/portfolio", icon: "User" },
];

export const SIDEBAR_FACULTY_LINKS = [
  { name: "Dashboard", href: "/faculty", icon: "LayoutDashboard" },
  { name: "Courses", href: "/faculty/courses", icon: "BookOpen" },
  { name: "Students", href: "/faculty/students", icon: "Users" },
  { name: "Learning Analytics", href: "/faculty/analytics", icon: "BarChart3" },
  { name: "AI Teaching Assistant", href: "/faculty/ai-assistant", icon: "Bot" },
  { name: "Reports", href: "/faculty/reports", icon: "FileText" },
  { name: "Interventions", href: "/faculty/interventions", icon: "Shield" },
  { name: "Settings", href: "#", icon: "Settings" },
  { name: "Profile", href: "#", icon: "User" },
];

export const ANALYSIS_STEPS = [
  { num: 1, name: "Reading Submission", desc: "Parsing source material and understanding context." },
  { num: 2, name: "Extracting Concepts", desc: "Identifying key principles and relationships." },
  { num: 3, name: "Analysing Learning Objectives", desc: "Mapping to educational outcomes." },
  { num: 4, name: "Analysing Concept Relationships", desc: "Building knowledge structure." },
  { num: 5, name: "Estimating Difficulty", desc: "Calculating cognitive load metrics." },
  { num: 6, name: "Generating Blueprint", desc: "Creating personalised learning roadmap." },
  { num: 7, name: "Preparing Adaptive Validation", desc: "Setting up evaluation framework." },
];

export const MOCK_STUDENT = {
  id: "student-1",
  name: "Adhyatma",
  email: "adhyatma@university.edu",
  role: "student" as const,
};

export const MOCK_FACULTY = {
  id: "faculty-1",
  name: "Prof. Sharma",
  email: "sharma@university.edu",
  role: "faculty" as const,
};

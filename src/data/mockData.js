// Mock Data for ResumeIQ AI-Powered Resume Analyzer

export const defaultAnalysisResult = {
  resumeName: "Alex_Morgan_Resume_2026.pdf",
  fileSize: "245 KB",
  analyzedAt: "Just now",
  overallScore: 78,
  overallStatus: "Good – Your resume has strong potential.",
  overallSummary: "Your resume presents strong technical foundations and consistent project delivery. To reach top-tier ATS rankings (90%+), incorporate quantifiable metrics into your impact statements and bridge the key cloud/DevOps gaps.",
  
  metrics: {
    atsReadiness: {
      score: 82,
      label: "ATS Compatibility",
      status: "High",
      description: "Parses cleanly across major ATS systems (Workday, Greenhouse, Lever).",
      color: "indigo"
    },
    skillsMatch: {
      score: 86,
      label: "Skills Match",
      status: "Strong",
      description: "Covers 86% of typical Senior Software Engineer core skill requirements.",
      color: "purple"
    },
    keywordOptimization: {
      score: 69,
      label: "Keyword Optimization",
      status: "Moderate",
      description: "Keyword density can be improved for cloud architecture & containerization.",
      color: "cyan"
    },
    resumeStructure: {
      score: 90,
      label: "Resume Structure",
      status: "Excellent",
      description: "Well-organized hierarchy, clean typography, consistent chronological flow.",
      color: "emerald"
    }
  },

  matchedSkills: [
    { name: "React", category: "Frontend", level: "Advanced", occurrences: 6 },
    { name: "JavaScript", category: "Language", level: "Expert", occurrences: 8 },
    { name: "Python", category: "Language", level: "Proficient", occurrences: 4 },
    { name: "Java", category: "Language", level: "Proficient", occurrences: 3 },
    { name: "SQL", category: "Database", level: "Proficient", occurrences: 5 },
    { name: "Git", category: "Tools", level: "Expert", occurrences: 5 },
    { name: "Spring Boot", category: "Backend", level: "Proficient", occurrences: 3 },
    { name: "HTML5", category: "Frontend", level: "Expert", occurrences: 7 },
    { name: "CSS3", category: "Frontend", level: "Expert", occurrences: 6 },
    { name: "TypeScript", category: "Language", level: "Proficient", occurrences: 4 },
    { name: "REST APIs", category: "Backend", level: "Advanced", occurrences: 5 },
    { name: "Node.js", category: "Backend", level: "Proficient", occurrences: 3 }
  ],

  missingSkills: [
    { name: "Docker", category: "DevOps", priority: "High", reason: "Required by 75% of modern backend/full-stack postings." },
    { name: "AWS", category: "Cloud", priority: "High", reason: "Most requested cloud platform across relevant job targets." },
    { name: "Kubernetes", category: "DevOps", priority: "Medium", reason: "Frequently desired for microservice scalability." },
    { name: "CI/CD", category: "DevOps", priority: "Medium", reason: "Automated pipelines are essential for continuous deployment." }
  ],

  recommendations: [
    {
      id: "rec-1",
      title: "Add more measurable achievements.",
      priority: "High",
      category: "Impact & Metrics",
      icon: "TrendingUp",
      description: "Recruiters and hiring managers look for the tangible business impact of your work rather than a list of passive duties.",
      example: {
        before: "Worked on a web application for internal analytics.",
        after: "Developed a responsive web analytics application used by 5,000+ daily active users, reducing report generation latency by 42%."
      },
      actionTip: "Use the 'X-Y-Z formula': Accomplished [X] as measured by [Y], by doing [Z]."
    },
    {
      id: "rec-2",
      title: "Improve keyword optimization for cloud technologies.",
      priority: "High",
      category: "ATS Keywords",
      icon: "Key",
      description: "Your resume is missing critical cloud orchestration and container keywords that modern ATS filters actively search for.",
      example: {
        before: "Deployed backend services to server infrastructure.",
        after: "Containerized microservices using Docker and deployed onto AWS ECS with automated CI/CD GitHub Actions pipelines."
      },
      actionTip: "Add AWS (S3, EC2, Lambda) and Docker directly under your Technical Skills and Project highlights."
    },
    {
      id: "rec-3",
      title: "Add relevant technical skills and libraries.",
      priority: "Medium",
      category: "Skill Coverage",
      icon: "Code",
      description: "Highlight modern frontend state management (Redux Toolkit, Zustand) and testing frameworks (Jest, Vitest, Cypress).",
      example: {
        before: "Implemented testing on frontend components.",
        after: "Authored 120+ unit and integration tests using Vitest and React Testing Library, maintaining 94% test coverage."
      },
      actionTip: "Specify test frameworks and caching tools (Redis, React Query) in your skills summary."
    },
    {
      id: "rec-4",
      title: "Strengthen your professional summary.",
      priority: "Medium",
      category: "Resume Structure",
      icon: "FileText",
      description: "Your introductory summary should instantly communicate your years of experience, core tech stack, and primary value proposition.",
      example: {
        before: "Software developer looking for an exciting software engineering role in a fast-paced environment.",
        after: "Results-driven Software Engineer with 4+ years of experience building scalable React & Node.js web applications, optimizing API latency, and delivering SaaS solutions."
      },
      actionTip: "Keep the summary to 3-4 punchy lines packed with keywords and career achievements."
    }
  ],

  strengths: [
    {
      title: "Strong Technical Foundation",
      description: "Comprehensive coverage of core languages including React, JavaScript, Java, and Python with clear version control practices."
    },
    {
      title: "Good Project Experience",
      description: "Diverse portfolio of production projects demonstrating end-to-end full-stack development."
    },
    {
      title: "Clear Education & Formatting",
      description: "Well-structured sections with legible typography, clean bullet hierarchy, and standard chronological order."
    }
  ],

  areasToImprove: [
    {
      title: "Add Measurable Achievements",
      description: "Transform passive job descriptions into metric-driven impact statements (percentages, user counts, latency reductions)."
    },
    {
      title: "Improve ATS Keywords",
      description: "Incorporate industry-standard keywords like Microservices, Cloud Architecture, and Automated Testing."
    },
    {
      title: "Add Missing Cloud & DevOps Skills",
      description: "Integrate hands-on Docker and AWS mentions to boost your candidate match score across modern job postings."
    }
  ]
};

export const sampleResumes = [
  {
    id: "sample-se",
    name: "Alex_Morgan_FullStack_Resume.pdf",
    role: "Full Stack Software Engineer",
    size: "245 KB",
    previewScore: 78,
    data: defaultAnalysisResult
  },
  {
    id: "sample-fe",
    name: "Sarah_Chen_Frontend_Lead.pdf",
    role: "Senior Frontend Engineer",
    size: "310 KB",
    previewScore: 86,
    data: {
      ...defaultAnalysisResult,
      resumeName: "Sarah_Chen_Frontend_Lead.pdf",
      overallScore: 86,
      overallStatus: "Excellent – Standout competitive candidate.",
      metrics: {
        atsReadiness: { score: 91, label: "ATS Compatibility", status: "Exceptional", description: "Top 5% parser rating for frontend engineering roles.", color: "emerald" },
        skillsMatch: { score: 89, label: "Skills Match", status: "Strong", description: "Includes Next.js, TypeScript, Tailwind, GraphQL, Vitest.", color: "indigo" },
        keywordOptimization: { score: 82, label: "Keyword Optimization", status: "Good", description: "High keyword density for Modern Web Architecture.", color: "purple" },
        resumeStructure: { score: 94, label: "Resume Structure", status: "Flawless", description: "Clean single-column ATS optimized format.", color: "cyan" }
      }
    }
  },
  {
    id: "sample-ds",
    name: "David_Kim_Data_Scientist.pdf",
    role: "AI & Data Science Specialist",
    size: "280 KB",
    previewScore: 72,
    data: {
      ...defaultAnalysisResult,
      resumeName: "David_Kim_Data_Scientist.pdf",
      overallScore: 72,
      overallStatus: "Promising – Needs targeted keywords.",
      metrics: {
        atsReadiness: { score: 75, label: "ATS Compatibility", status: "Moderate", description: "Contains tables that may be simplified for ATS.", color: "cyan" },
        skillsMatch: { score: 80, label: "Skills Match", status: "Good", description: "Strong PyTorch, Scikit-Learn, Pandas, SQL foundations.", color: "indigo" },
        keywordOptimization: { score: 65, label: "Keyword Optimization", status: "Needs Improvement", description: "Missing MLOps, Docker, and CI/CD pipelines.", color: "purple" },
        resumeStructure: { score: 85, label: "Resume Structure", status: "Good", description: "Clean structure but could use more quantifiable business impact.", color: "emerald" }
      }
    }
  }
];

export const sampleJobDescriptions = [
  {
    id: "job-fs",
    title: "Senior Full Stack Engineer (React + Node + Cloud)",
    company: "TechNova Cloud Solutions",
    description: `We are looking for a Senior Full Stack Engineer to lead the development of our high-scale cloud SaaS platform.

Responsibilities:
- Build modern, responsive web applications using React, TypeScript, and Tailwind CSS.
- Design resilient backend microservices with Node.js, Express, and REST APIs.
- Manage relational and NoSQL databases including PostgreSQL and SQL queries.
- Deploy, monitor, and scale services on AWS infrastructure using Docker and Kubernetes.
- Collaborate across engineering teams using Git, GitHub Actions CI/CD pipelines.

Requirements:
- 4+ years experience with React, JavaScript/TypeScript, and modern frontend tools.
- Hands-on experience with REST APIs, SQL databases, and backend performance tuning.
- Experience with Docker, Kubernetes, and AWS cloud services (S3, EC2, ECS, Lambda).
- Strong understanding of CI/CD, Git workflows, and unit/integration testing.`
  },
  {
    id: "job-fe",
    title: "Frontend Architect / Lead React Engineer",
    company: "Starlight Interactive",
    description: `We are hiring a Frontend Architect to shape the next generation of our design system and real-time collaboration UI.

Key Requirements:
- Expert proficiency in React, JavaScript (ES6+), TypeScript, and CSS3 / modern UI patterns.
- Strong architectural mindset for scalable state management (Redux Toolkit / Zustand) and REST APIs.
- Experience with performance profiling, bundle size optimization, and accessibility (a11y).
- Familiarity with CI/CD, Git version control, and automated frontend testing.`
  },
  {
    id: "job-devops",
    title: "Cloud & DevOps Solutions Engineer",
    company: "ScaleGrid Systems",
    description: `ScaleGrid is seeking a Cloud & DevOps Engineer to automate deployment workflows and manage resilient distributed clusters.

Requirements:
- Strong Linux & scripting skills (Python, Bash).
- Deep expertise in AWS (IAM, VPC, EKS, CloudWatch), Docker containerization, and Kubernetes orchestration.
- Proven track record implementing CI/CD pipelines with GitHub Actions or GitLab CI.
- Infrastructure as Code (Terraform) and database management (SQL / Redis).`
  }
];

export const mockUserProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "Software Engineer",
  targetRole: "Senior Full Stack Engineer",
  location: "San Francisco, CA",
  joinedDate: "January 2026",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  stats: {
    resumesAnalyzed: 3,
    avgScore: 78,
    bestScore: 86,
    jobsMatched: 5
  },
  history: [
    {
      id: "hist-1",
      filename: "Sarah_Chen_Frontend_Lead.pdf",
      date: "Aug 28, 2026",
      score: 86,
      status: "Excellent",
      type: "Frontend Lead"
    },
    {
      id: "hist-2",
      filename: "Alex_Morgan_Resume_2026.pdf",
      date: "Aug 25, 2026",
      score: 78,
      status: "Good",
      type: "Full Stack SE"
    },
    {
      id: "hist-3",
      filename: "David_Kim_Data_Scientist.pdf",
      date: "Aug 18, 2026",
      score: 72,
      status: "Promising",
      type: "Data Science"
    }
  ]
};

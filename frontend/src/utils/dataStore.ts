// src/utils/dataStore.ts
// Global data store for resumes with recent activity tracking

export interface ResumeData {
  id: number;
  filename: string;
  score: number;
  time: string;
  status: 'High' | 'Medium' | 'Low';
  analysis?: {
    skills: number;
    experience: number;
    education: number;
    keywords: number;
    format: number;
  };
  strengths?: string[];
  improvements?: string[];
  missingKeywords?: string[];
}

export interface Activity {
  id: number;
  type: 'upload' | 'analysis' | 'download';
  message: string;
  time: string;
  resumeId?: number;
}

// Initial mock data
let resumes: ResumeData[] = [
  { 
    id: 1, 
    filename: "Full Stack Developer Resume.pdf", 
    score: 85, 
    time: "2 hours ago", 
    status: "High",
    analysis: {
      skills: 90,
      experience: 85,
      education: 80,
      keywords: 75,
      format: 85,
    },
    strengths: [
      "Good use of action verbs",
      "Well-structured experience section",
      "Relevant skills for the job",
      "No grammar or spelling mistakes",
      "Consistent formatting",
    ],
    improvements: [
      "Add more quantifiable achievements",
      "Include more relevant keywords",
      "Add certifications (if any)",
      "Include a professional summary",
    ],
    missingKeywords: ["TypeScript", "Next.js", "AWS", "Docker", "CI/CD", "Redux", "Jest", "GraphQL"],
  },
  { 
    id: 2, 
    filename: "Frontend Developer Resume.pdf", 
    score: 78, 
    time: "1 day ago", 
    status: "Medium",
    analysis: {
      skills: 80,
      experience: 75,
      education: 70,
      keywords: 85,
      format: 80,
    },
    strengths: [
      "Good use of modern frameworks",
      "Strong UI/UX focus",
      "Relevant technologies",
    ],
    improvements: [
      "Add more backend experience",
      "Include testing skills",
    ],
    missingKeywords: ["TypeScript", "Next.js", "AWS", "Docker"],
  },
  { 
    id: 3, 
    filename: "Backend Developer Resume.pdf", 
    score: 92, 
    time: "3 days ago", 
    status: "High",
    analysis: {
      skills: 95,
      experience: 90,
      education: 85,
      keywords: 95,
      format: 95,
    },
    strengths: [
      "Strong backend architecture skills",
      "Good use of microservices",
      "Excellent cloud experience",
    ],
    improvements: [
      "Add frontend experience",
      "Include more soft skills",
    ],
    missingKeywords: ["React", "Next.js", "GraphQL"],
  },
];

let nextId = 4;
let nextActivityId = 1;
let activities: Activity[] = [
  {
    id: nextActivityId++,
    type: 'upload',
    message: 'Uploaded "Full Stack Developer Resume.pdf"',
    time: '2 hours ago',
    resumeId: 1,
  },
  {
    id: nextActivityId++,
    type: 'analysis',
    message: 'Analyzed "Frontend Developer Resume.pdf" - Score: 78/100',
    time: '1 day ago',
    resumeId: 2,
  },
  {
    id: nextActivityId++,
    type: 'download',
    message: 'Downloaded report for "Backend Developer Resume.pdf"',
    time: '3 days ago',
    resumeId: 3,
  },
];

// Get all resumes
export const getResumes = (): ResumeData[] => {
  return resumes;
};

// Get a single resume by ID
export const getResumeById = (id: number): ResumeData | undefined => {
  return resumes.find(r => r.id === id);
};

// Add a new resume
export const addResume = (resume: Omit<ResumeData, 'id' | 'time'>): ResumeData => {
  const newResume: ResumeData = {
    ...resume,
    id: nextId++,
    time: "Just now",
    status: resume.score >= 80 ? "High" : resume.score >= 60 ? "Medium" : "Low",
  };
  resumes = [newResume, ...resumes];
  
  // Add activity
  addActivity({
    type: 'upload',
    message: `Uploaded "${resume.filename}"`,
    resumeId: newResume.id,
  });
  
  return newResume;
};

// ===== RECENT ACTIVITY FUNCTIONS =====
export const getActivities = (): Activity[] => {
  return activities;
};

export const addActivity = (activity: Omit<Activity, 'id' | 'time'>): Activity => {
  const newActivity: Activity = {
    ...activity,
    id: nextActivityId++,
    time: 'Just now',
  };
  activities = [newActivity, ...activities];
  return newActivity;
};

export const addAnalysisActivity = (filename: string, score: number, resumeId: number) => {
  addActivity({
    type: 'analysis',
    message: `Analyzed "${filename}" - Score: ${score}/100`,
    resumeId: resumeId,
  });
};

export const addDownloadActivity = (filename: string, resumeId: number) => {
  addActivity({
    type: 'download',
    message: `Downloaded report for "${filename}"`,
    resumeId: resumeId,
  });
};

// Get stats
export const getStats = () => {
  return {
    total: resumes.length,
    avgScore: resumes.length > 0 
      ? Math.round(resumes.reduce((sum, r) => sum + r.score, 0) / resumes.length)
      : 0,
    highest: resumes.length > 0 ? Math.max(...resumes.map(r => r.score)) : 0,
    lowest: resumes.length > 0 ? Math.min(...resumes.map(r => r.score)) : 0,
  };
};

// Get chart data
export const getChartData = () => {
  return resumes.map(r => ({
    name: r.filename.substring(0, 20) + (r.filename.length > 20 ? '...' : ''),
    score: r.score,
  }));
};
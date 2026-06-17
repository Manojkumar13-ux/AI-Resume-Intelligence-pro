// src/utils/dataStore.ts – In‑memory data store for resumes

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

// Mock data – replace with real API calls later
let resumes: ResumeData[] = [
  {
    id: 1,
    filename: "Full Stack Developer Resume.pdf",
    score: 85,
    time: "2 hours ago",
    status: "High",
    analysis: { skills: 90, experience: 85, education: 80, keywords: 75, format: 85 },
    strengths: ["Good use of action verbs", "Well-structured experience section"],
    improvements: ["Add more quantifiable achievements", "Include more keywords"],
    missingKeywords: ["TypeScript", "Next.js", "AWS"]
  },
  // add more mock resumes if needed
];

let nextId = 4;
let activities: Activity[] = [
  { id: 1, type: 'upload', message: 'Uploaded "Full Stack Developer Resume.pdf"', time: '2 hours ago', resumeId: 1 },
];

export const getResumes = (): ResumeData[] => resumes;
export const getResumeById = (id: number): ResumeData | undefined => resumes.find(r => r.id === id);
export const addResume = (resume: Omit<ResumeData, 'id' | 'time'>): ResumeData => {
  const newResume: ResumeData = {
    ...resume,
    id: nextId++,
    time: "Just now",
    status: resume.score >= 80 ? "High" : resume.score >= 60 ? "Medium" : "Low",
  };
  resumes = [newResume, ...resumes];
  addActivity({ type: 'upload', message: `Uploaded "${resume.filename}"`, resumeId: newResume.id });
  return newResume;
};

export const getActivities = (): Activity[] => activities;
export const addActivity = (activity: Omit<Activity, 'id' | 'time'>): Activity => {
  const newActivity: Activity = { ...activity, id: activities.length + 1, time: 'Just now' };
  activities = [newActivity, ...activities];
  return newActivity;
};

export const getStats = () => {
  const total = resumes.length;
  const avgScore = total ? Math.round(resumes.reduce((s, r) => s + r.score, 0) / total) : 0;
  const highest = total ? Math.max(...resumes.map(r => r.score)) : 0;
  const lowest = total ? Math.min(...resumes.map(r => r.score)) : 0;
  return { total, avgScore, highest, lowest };
};

export const getChartData = () => resumes.map(r => ({
  name: r.filename.length > 20 ? r.filename.substring(0, 20) + '...' : r.filename,
  score: r.score,
}));

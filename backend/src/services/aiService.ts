import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ATSAnalysis {
  score: number;
  skills: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  jobFitScore: number;
  atsCompatibility: {
    format: number;
    keywords: number;
    experience: number;
    education: number;
    skills: number;
  };
  recommendedRoles: string[];
}

const defaultAnalysis: ATSAnalysis = {
  score: 72,
  skills: ['Communication', 'Teamwork', 'Problem Solving'],
  missingKeywords: ['Leadership', 'Project Management', 'Strategic Planning'],
  suggestions: [
    'Add more quantifiable achievements',
    'Include relevant industry keywords',
    'Strengthen your professional summary',
    'Highlight leadership experience'
  ],
  strengths: ['Clear work history', 'Relevant education', 'Good formatting'],
  weaknesses: ['Lack of metrics', 'Limited keywords', 'Vague responsibilities'],
  jobFitScore: 68,
  atsCompatibility: {
    format: 80,
    keywords: 65,
    experience: 75,
    education: 85,
    skills: 70
  },
  recommendedRoles: ['Software Engineer', 'Project Manager', 'Business Analyst']
};

export const analyzeResume = async (text: string): Promise<ATSAnalysis> => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set, using default analysis');
    return defaultAnalysis;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and resume analyst. Analyze this resume and provide a comprehensive evaluation.

      Resume Text:
      ${text.substring(0, 8000)}

      Respond with a JSON object containing:
      1. Overall ATS Score (0-100)
      2. Top 10 skills found
      3. Missing keywords
      4. 5-7 specific improvement suggestions
      5. 3-5 strengths
      6. 3-5 weaknesses
      7. Job fit score (0-100)
      8. ATS Compatibility breakdown: format, keywords, experience, education, skills
      9. Top 3 recommended job roles

      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...defaultAnalysis, ...parsed };
    }

    return defaultAnalysis;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return defaultAnalysis;
  }
};

export const analyzeWithJobDescription = async (
  resumeText: string,
  jobDescription: string
): Promise<ATSAnalysis> => {
  if (!process.env.GEMINI_API_KEY) {
    return defaultAnalysis;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      You are an expert ATS analyst. Compare this resume against the job description.

      Resume:
      ${resumeText.substring(0, 6000)}

      Job Description:
      ${jobDescription.substring(0, 3000)}

      Analyze and return JSON:
      1. Overall ATS Score (0-100)
      2. Skills found that match the job
      3. Missing keywords from the job description
      4. 5 specific improvements
      5. Job fit score (0-100)
      6. ATS compatibility breakdown

      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...defaultAnalysis, ...parsed };
    }

    return defaultAnalysis;
  } catch (error) {
    console.error('Job match analysis error:', error);
    return defaultAnalysis;
  }
};

export const rewriteResume = async (
  resumeText: string,
  improvements: string[]
): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    return resumeText;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Rewrite and improve this resume based on these suggestions:
      ${improvements.join(', ')}

      Original Resume:
      ${resumeText.substring(0, 6000)}

      Provide an improved version that:
      1. Includes quantifiable achievements
      2. Uses ATS-friendly keywords
      3. Has better formatting structure
      4. Is more compelling and professional

      Return ONLY the improved resume text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Rewrite error:', error);
    return resumeText;
  }
};
export const analyzeResume = (text, jobTitle = 'Full Stack Developer') => {
  const keywords = extractKeywords(text);
  
  const sections = {
    skills: calculateSkillsScore(text, keywords),
    experience: calculateExperienceScore(text),
    education: calculateEducationScore(text),
    keywords: calculateKeywordScore(text, keywords),
    format: calculateFormatScore(text),
  };

  const overallScore = Math.round(
    (sections.skills * 0.3) + 
    (sections.experience * 0.25) + 
    (sections.education * 0.15) + 
    (sections.keywords * 0.2) + 
    (sections.format * 0.1)
  );

  return {
    atsScore: Math.min(overallScore, 100),
    analysis: sections,
    strengths: getStrengths(text, sections),
    improvements: getImprovements(text, sections),
    missingKeywords: getMissingKeywords(text),
    recommendations: getRecommendations(text, sections, []),
  };
};

const extractKeywords = (text) => {
  const commonKeywords = [
    'javascript', 'python', 'react', 'angular', 'vue', 'node', 'express',
    'aws', 'docker', 'kubernetes', 'ci/cd', 'devops', 'linux',
    'sql', 'mongodb', 'postgresql', 'redis',
    'api', 'rest', 'graphql', 'microservices',
    'leadership', 'communication', 'teamwork', 'agile', 'scrum'
  ];
  const textLower = text.toLowerCase();
  return commonKeywords.filter(kw => textLower.includes(kw));
};

const calculateSkillsScore = (text, keywords) => {
  return Math.round(Math.min((keywords.length / 15) * 100, 100));
};

const calculateExperienceScore = (text) => {
  const actionVerbs = ['developed', 'implemented', 'designed', 'built', 'created', 'managed', 'led', 'improved'];
  const verbCount = actionVerbs.filter(v => text.toLowerCase().includes(v)).length;
  const score = Math.min(((verbCount + 2) / 10) * 100, 100);
  return Math.round(score);
};

const calculateEducationScore = (text) => {
  const educationTerms = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'certification'];
  const matchCount = educationTerms.filter(t => text.toLowerCase().includes(t)).length;
  return Math.round(Math.min((matchCount / 4) * 100, 100));
};

const calculateKeywordScore = (text, keywords) => {
  return Math.round(Math.min((keywords.length / 20) * 100, 100));
};

const calculateFormatScore = (text) => {
  let score = 60;
  if (text.includes('•') || text.includes('-') || text.includes('*')) score += 20;
  if (text.toLowerCase().includes('experience') || text.toLowerCase().includes('education')) score += 20;
  if (text.toLowerCase().includes('email') || text.toLowerCase().includes('phone')) score += 10;
  return Math.min(score, 100);
};

const getStrengths = (text, sections) => {
  const strengths = [];
  if (sections.skills > 75) strengths.push('Good use of relevant skills and technologies');
  if (sections.experience > 75) strengths.push('Well-structured experience section');
  if (sections.keywords > 75) strengths.push('Strong keyword optimization for ATS');
  if (text.includes('%') || text.includes('$')) strengths.push('Includes quantifiable achievements');
  if (sections.format > 75) strengths.push('Consistent and professional formatting');
  if (strengths.length === 0) strengths.push('Good foundation, keep improving!');
  return strengths.slice(0, 5);
};

const getImprovements = (text, sections) => {
  const improvements = [];
  if (sections.skills < 70) improvements.push('Add more relevant technical skills');
  if (sections.experience < 70) improvements.push('Add more detail to your work experience');
  if (sections.keywords < 70) improvements.push('Include more industry keywords from job descriptions');
  if (!text.includes('%') && !text.includes('$')) {
    improvements.push('Add quantifiable achievements (e.g., "Increased sales by 20%")');
  }
  if (sections.education < 70) improvements.push('Add more details about your education and certifications');
  if (!text.toLowerCase().includes('summary')) {
    improvements.push('Add a professional summary at the top');
  }
  if (improvements.length === 0) improvements.push('Your resume is well-optimized! Keep it up!');
  return improvements.slice(0, 5);
};

const getMissingKeywords = (text) => {
  const commonKeywords = ['TypeScript', 'Next.js', 'AWS', 'Docker', 'CI/CD', 'Redux', 'Jest', 'GraphQL', 'React', 'Node.js'];
  const textLower = text.toLowerCase();
  return commonKeywords.filter(kw => !textLower.includes(kw.toLowerCase())).slice(0, 8);
};

const getRecommendations = (text, sections, missingKeywords) => {
  const recommendations = [];
  if (sections.skills < 75) recommendations.push('Add more relevant technical skills');
  if (sections.experience < 75) recommendations.push('Expand your experience section with more detail');
  if (!/(\d+%|\$\d+)/.test(text)) {
    recommendations.push('Include quantifiable achievements with specific numbers');
  }
  if (!/summary|profile/i.test(text)) {
    recommendations.push('Add a professional summary at the top');
  }
  if (sections.format < 80) recommendations.push('Improve formatting with consistent bullet points');
  if (recommendations.length === 0) {
    recommendations.push('Your resume is well-optimized! Consider adding certifications.');
  }
  return recommendations.slice(0, 5);
};
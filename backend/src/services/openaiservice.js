import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAIFeedback = async (resumeText, jobTitle = 'Full Stack Developer') => {
  try {
    const prompt = `
      Analyze this resume for a ${jobTitle} position.

      RESUME TEXT:
      ${resumeText.substring(0, 4000)}

      Return ONLY valid JSON with this structure:
      {
        "summary": "Overall assessment",
        "atsScore": 85,
        "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
        "improvements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4", "improvement 5"],
        "missingKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
        "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional resume reviewer. Return ONLY valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    let jsonStr = content;
    if (content.includes('```json')) {
      jsonStr = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonStr = content.split('```')[1].split('```')[0].trim();
    }
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('OpenAI error:', error);
    return null;
  }
};

export const getFallbackFeedback = (text) => {
  const hasMetrics = /(\d+%|\$\d+)/.test(text);
  const hasActionVerbs = /(developed|implemented|designed|built|created|managed|led|improved)/i.test(text);

  const strengths = [];
  if (hasActionVerbs) strengths.push('Good use of action verbs');
  if (hasMetrics) strengths.push('Includes quantifiable achievements');
  if (strengths.length === 0) strengths.push('Resume has a solid foundation');

  const improvements = [];
  if (!hasMetrics) improvements.push('Add more quantifiable achievements');
  if (!hasActionVerbs) improvements.push('Use more action verbs');
  if (!text.toLowerCase().includes('summary')) improvements.push('Add a professional summary at the top');
  if (improvements.length === 0) improvements.push('Your resume is well-optimized!');

  return {
    summary: 'Your resume shows good potential. Follow the recommendations below to improve.',
    atsScore: Math.min(Math.floor(Math.random() * 20 + 70), 95),
    strengths: strengths.slice(0, 5),
    improvements: improvements.slice(0, 5),
    missingKeywords: ['TypeScript', 'Next.js', 'AWS', 'Docker', 'CI/CD', 'Redux', 'Jest', 'GraphQL'].slice(0, 5),
    recommendations: [
      'Add more quantifiable achievements with specific numbers',
      'Include industry keywords relevant to your target role',
      'Ensure consistent formatting throughout your resume',
      'Add a professional summary at the top',
    ],
  };
};
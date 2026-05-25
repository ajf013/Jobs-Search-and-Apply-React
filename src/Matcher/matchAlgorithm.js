const STOP_WORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 
  'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 
  'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 
  'weren', 'won', 'wouldn'
]);

// Tech terms that we want to scan for priority scoring and recommendations
const TECH_SKILLS = [
  'react', 'angular', 'vue', 'javascript', 'typescript', 'python', 'java', 'node', 'express',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'sql', 'nosql', 'mongodb', 'postgresql', 
  'git', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'scrum', 'agile', 'rest', 'graphql',
  'ci/cd', 'devops', 'testing', 'cypress', 'jest', 'php', 'laravel', 'django', 'flask',
  'ruby', 'rails', 'c++', 'c#', 'rust', 'go', 'kotlin', 'swift'
];

export function calculateMatchScore(resumeText, jobDescription) {
  if (!resumeText || !jobDescription) return { score: 0, matchedKeywords: [], missingKeywords: [] };

  const getCleanWords = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s#+]/g, ' ') // Preserve symbols like C#, C++
      .split(/\s+/)
      .filter(word => word.length > 2 && !STOP_WORDS.has(word));
  };

  const resumeWords = getCleanWords(resumeText);
  const jobWords = getCleanWords(jobDescription);

  if (resumeWords.length === 0 || jobWords.length === 0) {
    return { score: 0, matchedKeywords: [], missingKeywords: [] };
  }

  const resumeSet = new Set(resumeWords);
  const jobSet = new Set(jobWords);

  const matchedKeywords = [];
  const missingKeywords = [];

  // Identify overlap
  jobSet.forEach(word => {
    if (resumeSet.has(word)) {
      matchedKeywords.push(word);
    } else if (TECH_SKILLS.includes(word)) {
      missingKeywords.push(word);
    }
  });

  // Calculate score: proportion of job keywords covered
  // We normalize to a maximum of 12 distinct keywords to make 100% achievable for well-matched resumes
  const keywordTarget = Math.min(12, jobSet.size || 12);
  const scoreRaw = matchedKeywords.length / keywordTarget;
  const score = Math.min(100, Math.round(scoreRaw * 100));

  // Capitalize for display
  const capitalize = (word) => {
    if (word === 'javascript') return 'JavaScript';
    if (word === 'typescript') return 'TypeScript';
    if (word === 'html') return 'HTML';
    if (word === 'css') return 'CSS';
    if (word === 'aws') return 'AWS';
    if (word === 'gcp') return 'GCP';
    if (word === 'sql') return 'SQL';
    if (word === 'nosql') return 'NoSQL';
    if (word === 'mongodb') return 'MongoDB';
    if (word === 'postgresql') return 'PostgreSQL';
    if (word === 'rest') return 'REST';
    if (word === 'graphql') return 'GraphQL';
    if (word === 'ci/cd') return 'CI/CD';
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return {
    score,
    matchedKeywords: [...new Set(matchedKeywords)].map(capitalize).slice(0, 10),
    missingKeywords: [...new Set(missingKeywords)].map(capitalize).slice(0, 8)
  };
}

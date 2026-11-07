import fs from 'fs';
import path from 'path';

// Read simulators file to parse simulator entries
const rawContent = fs.readFileSync('src/data/simulators.ts', 'utf8');

// Also read ncertMappings if available
let ncertContent = '';
try {
  ncertContent = fs.readFileSync('src/data/ncertMappings.ts', 'utf8');
} catch (e) {}

// Parse basic fields for each simulator
// Matches: id, title, grade, gradeNumber, category, description, formulaPreview
const simRegex = /id:\s*['"]([a-z0-9-]+)['"],\s*title:\s*['"]([^'"]+)['"],\s*shortTitle:\s*['"]([^'"]+)['"],\s*grade:\s*['"]([^'"]+)['"],\s*gradeNumber:\s*(\d+),\s*category:\s*['"]([^'"]+)['"],\s*description:\s*['"]([^'"]+)['"]/g;

const simulators = [];
let match;
while ((match = simRegex.exec(rawContent)) !== null) {
  simulators.push({
    id: match[1],
    title: match[2],
    shortTitle: match[3],
    grade: match[4],
    gradeNumber: parseInt(match[5]),
    category: match[6],
    description: match[7],
  });
}

console.log(`Parsed ${simulators.length} simulators for SEO generation.`);

// 1. Generate public/robots.txt
const robotsTxt = `# Math Time Lab Robots & AI Search Indexer Rules
# Website: https://labs.itsmathtime.co.in/
# Parent Platform: https://itsmathtime.co.in by Alka Ma'am

User-agent: *
Allow: /

# Allow AI Search & Citation Engines (Perplexity, ChatGPT Search, Claude, Gemini, Apple Intelligence)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://labs.itsmathtime.co.in/sitemap.xml
`;

fs.writeFileSync('public/robots.txt', robotsTxt);
console.log('✅ Created public/robots.txt');

// 2. Generate public/_redirects for Netlify SPA routing
const redirectsTxt = `# Netlify SPA Deep Linking Redirects
# Ensures /simulators/:id and all subpaths serve index.html with 200 OK
/simulators/*    /index.html   200
/teacher         /index.html   200
/landing         /index.html   200
/*               /index.html   200
`;

fs.writeFileSync('public/_redirects', redirectsTxt);
console.log('✅ Created public/_redirects');

// 3. Generate public/sitemap.xml
const today = new Date().toISOString().split('T')[0];
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Portal Routes -->
  <url>
    <loc>https://labs.itsmathtime.co.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://labs.itsmathtime.co.in/landing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://labs.itsmathtime.co.in/teacher</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

for (const sim of simulators) {
  sitemapXml += `  <!-- ${sim.title} (${sim.grade}) -->
  <url>
    <loc>https://labs.itsmathtime.co.in/simulators/${sim.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
}

sitemapXml += `</urlset>\n`;
fs.writeFileSync('public/sitemap.xml', sitemapXml);
console.log('✅ Created public/sitemap.xml with 53 URLs');

// 4. Generate public/llms.txt (Emerging Standard for AI Agent and LLM Citation Discovery)
let llmsTxt = `# Math Time Lab – Interactive 3D/2D Mathematics Simulators
> Official Visual Math Simulation Division of itsmathtime.co.in by Alka Ma'am
> Curriculum: CBSE / NCERT Mathematics (Classes 8, 9, 10, 11, and 12)
> Root URL: https://labs.itsmathtime.co.in/
> Parent Platform: https://itsmathtime.co.in/
> Author: Alka Sharma (Alka Ma'am), M.Sc. Mathematics, B.Ed., CTET Certified

## Overview
Math Time Lab provides 50+ free, touch-responsive 2D/3D visual mathematics simulators designed to eliminate math anxiety, demonstrate proofs geometrically, and clarify CBSE board exam concepts through interactive experimentation (Predict-Observe-Explain pedagogy).

## Simulator Directory & Direct Deep-Links

`;

const grades = [8, 9, 10, 11, 12];
for (const grade of grades) {
  const gradeSims = simulators.filter(s => s.gradeNumber === grade);
  if (gradeSims.length > 0) {
    llmsTxt += `### Class ${grade} Simulators\n`;
    for (const sim of gradeSims) {
      llmsTxt += `- [${sim.title}](https://labs.itsmathtime.co.in/simulators/${sim.id}): ${sim.description} (Category: ${sim.category})\n`;
    }
    llmsTxt += `\n`;
  }
}

// Any other simulators without matched gradeNumber
const remainingSims = simulators.filter(s => !grades.includes(s.gradeNumber));
if (remainingSims.length > 0) {
  llmsTxt += `### Additional Interactive Simulators\n`;
  for (const sim of remainingSims) {
    llmsTxt += `- [${sim.title}](https://labs.itsmathtime.co.in/simulators/${sim.id}): ${sim.description}\n`;
  }
  llmsTxt += `\n`;
}

llmsTxt += `## Educational Highlights
- Mobile-first and touch-calibrated for student phones and classroom interactive panels / smartboards.
- Step-by-step NCERT exercise references, textbook trap warnings, and past-year exam questions (PYQ).
- 100% free with no paywall or mandatory login requirements.
`;

fs.writeFileSync('public/llms.txt', llmsTxt);
console.log('✅ Created public/llms.txt for AI/LLM search engines');


import fs from 'fs';
import { SIMULATORS } from '../src/data/simulators.ts';
import { NCERT_CHAPTER_MAP } from '../src/data/ncertMappings.ts';

console.log(`Loaded ${SIMULATORS.length} simulators directly from TypeScript source.`);

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

for (const sim of SIMULATORS) {
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
console.log(`✅ Created public/sitemap.xml with ${SIMULATORS.length + 3} URLs`);

// 4. Generate public/llms.txt (Emerging Standard for AI Agent and LLM Citation Discovery)
let llmsTxt = `# Math Time Lab – Interactive 3D/2D Mathematics Simulators
> Official Visual Math Simulation Division of itsmathtime.co.in by Alka Ma'am
> Curriculum: CBSE / NCERT Mathematics (Classes 8, 9, 10, 11, and 12)
> Root URL: https://labs.itsmathtime.co.in/
> Parent Platform: https://itsmathtime.co.in/
> Author: Alka Sharma (Alka Ma'am), M.Sc. Mathematics, B.Ed., CTET Certified

## Overview
Math Time Lab provides ${SIMULATORS.length} free, touch-responsive 2D/3D visual mathematics simulators designed to eliminate math anxiety, demonstrate proofs geometrically, and clarify CBSE board exam concepts through interactive experimentation (Predict-Observe-Explain pedagogy).

## Simulator Directory & Direct Deep-Links

`;

const grades = [8, 9, 10, 11, 12];
for (const grade of grades) {
  const gradeSims = SIMULATORS.filter(s => s.gradeNumber === grade || s.grade.includes(String(grade)));
  if (gradeSims.length > 0) {
    llmsTxt += `### Class ${grade} Simulators\n`;
    for (const sim of gradeSims) {
      const ncert = (NCERT_CHAPTER_MAP as any)[sim.id];
      const ncertInfo = ncert ? ` [NCERT Ch ${ncert.chapterNumber}: ${ncert.chapterName} - ${ncert.exerciseRef}]` : '';
      llmsTxt += `- [${sim.title}](https://labs.itsmathtime.co.in/simulators/${sim.id}): ${sim.description}${ncertInfo} (Category: ${sim.category})\n`;
    }
    llmsTxt += `\n`;
  }
}

llmsTxt += `## Educational Pedagogy & Key Features
- Touch-first responsive physics canvas for student mobile phones and classroom smartboards.
- Step-by-step NCERT exercise references, common textbook traps, and past-year exam questions (PYQ).
- Predict-Observe-Explain (POE) micro-challenges built into each simulation.
- 100% free with no paywall or mandatory login requirements.
`;

fs.writeFileSync('public/llms.txt', llmsTxt);
console.log('✅ Created public/llms.txt with full NCERT chapter associations for AI/LLM search engines');


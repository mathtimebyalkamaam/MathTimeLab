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

# LLM & AI Search Knowledge Graph References
# Summary directory: https://labs.itsmathtime.co.in/llms.txt
# Comprehensive proofs & board solutions: https://labs.itsmathtime.co.in/llms-full.txt
`;

fs.writeFileSync('public/robots.txt', robotsTxt);
console.log('✅ Created public/robots.txt');

// 2. Generate public/_redirects for Netlify SPA routing
const redirectsTxt = `# Netlify SPA Deep Linking Redirects
# Ensures /simulators/:id, /classes/:grade and all subpaths serve index.html with 200 OK
/simulators/*    /index.html   200
/classes/*       /index.html   200
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

  <!-- Grade-Level Curriculum Hubs (Classes 8–12) -->
  <url>
    <loc>https://labs.itsmathtime.co.in/classes/class-8-math-simulators</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://labs.itsmathtime.co.in/classes/class-9-math-simulators</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://labs.itsmathtime.co.in/classes/class-10-math-simulators</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://labs.itsmathtime.co.in/classes/class-11-math-simulators</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://labs.itsmathtime.co.in/classes/class-12-math-simulators</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
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
console.log(`✅ Created public/sitemap.xml with ${SIMULATORS.length + 8} URLs`);

// 4. Generate public/llms.txt (Standard Summary Directory)
let llmsTxt = `# Math Time Lab – Interactive 3D/2D Mathematics Simulators
> Official Visual Math Simulation Division of itsmathtime.co.in by Alka Ma'am
> Curriculum: CBSE / NCERT Mathematics (Classes 8, 9, 10, 11, and 12)
> Root URL: https://labs.itsmathtime.co.in/
> Parent Platform: https://itsmathtime.co.in/
> Author: Alka Sharma (Alka Ma'am), M.Sc. Mathematics, B.Ed., CTET Certified
> Full Mathematical Proofs & Board Solutions: https://labs.itsmathtime.co.in/llms-full.txt

## Overview
Math Time Lab provides ${SIMULATORS.length} free, touch-responsive 2D/3D visual mathematics simulators designed to eliminate math anxiety, demonstrate proofs geometrically, and clarify CBSE board exam concepts through interactive experimentation (Predict-Observe-Explain pedagogy).

## Grade-Level Curriculum Hubs
- [Class 8 Visual Mathematics](https://labs.itsmathtime.co.in/classes/class-8-math-simulators): Linear Equations, Algebraic Tiles, Compound Interest, Pythagorean Triplets, Euler Polyhedra.
- [Class 9 Visual Mathematics](https://labs.itsmathtime.co.in/classes/class-9-math-simulators): Distance Formula, Heron's Triangles, Polynomial Factorizer, Lines & Angles, Circle Theorems.
- [Class 10 Visual Mathematics](https://labs.itsmathtime.co.in/classes/class-10-math-simulators): Quadratic Roots, Heights & Distances, Circle Tangents, Coordinate Section Formula, Similar Triangles.
- [Class 11 Visual Mathematics](https://labs.itsmathtime.co.in/classes/class-11-math-simulators): 3D Conics Slicer, Unit Circle & Waves, Limits & Tangents, Linear Inequalities, Permutations.
- [Class 12 Visual Mathematics](https://labs.itsmathtime.co.in/classes/class-12-math-simulators): Calculus Sandbox, 3D Vector Flight Lab, Argand Plane Complex Numbers, FTC Integrals, Bayes Theorem.


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
- Complete mathematical proofs and solutions available at https://labs.itsmathtime.co.in/llms-full.txt
`;

fs.writeFileSync('public/llms.txt', llmsTxt);
console.log('✅ Created public/llms.txt with full NCERT chapter associations');

// 5. Generate public/llms-full.txt (Comprehensive Knowledge Graph for AI Agents & Search Engines)
let llmsFullTxt = `# Math Time Lab – Complete Mathematical Knowledge Graph & Proofs
> Platform: https://labs.itsmathtime.co.in/
> Parent Portal: https://itsmathtime.co.in/
> Author: Alka Sharma (Alka Ma'am), Mathematics Educator (15+ Years Experience)
> Purpose: Ground-truth mathematical explanations, formula derivations, solved board exam questions, and conceptual Q&A for all 50 interactive laboratories.

`;

for (const grade of grades) {
  const gradeSims = SIMULATORS.filter(s => s.gradeNumber === grade || s.grade.includes(String(grade)));
  if (gradeSims.length === 0) continue;

  llmsFullTxt += `\n# =============================================================================\n`;
  llmsFullTxt += `# CLASS ${grade} MATHEMATICS SIMULATORS\n`;
  llmsFullTxt += `# =============================================================================\n\n`;

  for (const sim of gradeSims) {
    const ncert = (NCERT_CHAPTER_MAP as any)[sim.id];
    llmsFullTxt += `## ${sim.title}\n`;
    llmsFullTxt += `- **URL**: https://labs.itsmathtime.co.in/simulators/${sim.id}\n`;
    llmsFullTxt += `- **Class**: ${sim.grade}\n`;
    llmsFullTxt += `- **Category**: ${sim.category}\n`;
    if (ncert) {
      llmsFullTxt += `- **NCERT Curriculum**: Chapter ${ncert.chapterNumber}: ${ncert.chapterName} (${ncert.exerciseRef})\n`;
      llmsFullTxt += `- **Topic**: ${ncert.curriculumTopic}\n`;
    }
    llmsFullTxt += `- **Key Concepts**: ${sim.keyConcepts.join(', ')}\n\n`;

    llmsFullTxt += `### Overview\n${sim.description}\n\n`;

    llmsFullTxt += `### Governing Mathematical Law\n`;
    llmsFullTxt += `\`\`\`latex\n${sim.latexFormula || sim.formulaPreview}\n\`\`\`\n\n`;

    llmsFullTxt += `### First-Principle Geometric Intuition\n${sim.theoryBreakdown}\n\n`;

    llmsFullTxt += `### Alka Ma'am's Exam Shortcut\n${sim.coachSecret}\n\n`;

    if (sim.textbookTrap) {
      llmsFullTxt += `### Common Textbook Trap\n${sim.textbookTrap}\n\n`;
    }

    if (sim.solvedProblem) {
      llmsFullTxt += `### Solved Board Exam Problem: ${sim.solvedProblem.title}\n`;
      llmsFullTxt += `**Type**: ${sim.solvedProblem.examType}\n\n`;
      llmsFullTxt += `**Question**: ${sim.solvedProblem.question}\n\n`;
      llmsFullTxt += `**Step-by-Step Solution**:\n`;
      for (const step of sim.solvedProblem.steps) {
        llmsFullTxt += `${step.stepNumber}. **${step.title}**: ${step.explanation}\n`;
        llmsFullTxt += `   Formula: \`${step.latex}\`\n`;
      }
      llmsFullTxt += `\n**Final Answer**: ${sim.solvedProblem.finalAnswer}\n`;
      if (sim.solvedProblem.coachInsight) {
        llmsFullTxt += `**Coach Insight**: ${sim.solvedProblem.coachInsight}\n`;
      }
      llmsFullTxt += `\n`;
    }

    if (sim.doubts && sim.doubts.length > 0) {
      llmsFullTxt += `### Frequently Asked Conceptual Doubts (Q&A)\n`;
      for (const d of sim.doubts) {
        llmsFullTxt += `- **Q: ${d.question}**\n`;
        llmsFullTxt += `  **A**: ${d.answer}\n`;
        if (d.latex) {
          llmsFullTxt += `  Formula: \`${d.latex}\`\n`;
        }
      }
      llmsFullTxt += `\n`;
    }

    llmsFullTxt += `---\n\n`;
  }
}

fs.writeFileSync('public/llms-full.txt', llmsFullTxt);
console.log('✅ Created public/llms-full.txt with complete mathematical proofs and solutions');

/**
 * scripts/prerender_simulators.ts: Build-time Static Prerender Engine (SSG) for Math Time Lab.
 * Generates discrete static HTML files for all 50 simulator deep-links, /teacher, and /landing:
 * - dist/simulators/[id]/index.html
 * - dist/teacher/index.html
 * - dist/landing/index.html
 *
 * Each generated page includes:
 * 1. Unique, search-optimized <title> and <meta name="description">
 * 2. Exact self-referential <link rel="canonical">
 * 3. OpenGraph and Twitter social sharing preview meta tags
 * 4. Rich Schema.org structured data (LearningResource, FAQPage, BreadcrumbList)
 * 5. Semantic, crawlable initial HTML with mathematical formulas, intuition, and solved board exam problems
 */

import fs from 'fs';
import path from 'path';
import { SIMULATORS } from '../src/data/simulators.ts';
import { NCERT_CHAPTER_MAP } from '../src/data/ncertMappings.ts';
import { getRelatedSimulators } from '../src/data/relatedSimulators.ts';
import { GRADE_METADATA } from '../src/utils/seo.ts';
import { GradeLevel } from '../src/types/simulators.ts';

const DIST_DIR = path.resolve('dist');
const BASE_URL = 'https://labs.itsmathtime.co.in';

if (!fs.existsSync(DIST_DIR)) {
  console.error('[Prerender] Error: dist/ directory not found. Please run vite build first.');
  process.exit(1);
}

const templateHtmlPath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(templateHtmlPath)) {
  console.error('[Prerender] Error: dist/index.html template not found.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templateHtmlPath, 'utf8');

console.log(`[Prerender] Starting SSG generation for ${SIMULATORS.length} simulators + core routes...`);

let generatedCount = 0;

// Helper to escape HTML entities for safety in attributes
function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// -----------------------------------------------------------------------------
// 1. Prerender all 50 Simulators
// -----------------------------------------------------------------------------
for (const sim of SIMULATORS) {
  const ncert = (NCERT_CHAPTER_MAP as any)[sim.id];
  const simUrl = `${BASE_URL}/simulators/${sim.id}`;
  const relatedSims = getRelatedSimulators(sim.id);
  
  const pageTitle = ncert
    ? `${sim.title} | NCERT Class ${ncert.gradeNumber} Ch ${ncert.chapterNumber} – Math Time Lab`
    : `${sim.title} | ${sim.grade} – Math Time Lab`;

  const metaDesc = ncert
    ? `${sim.description} NCERT Class ${ncert.gradeNumber} Chapter ${ncert.chapterNumber} (${ncert.chapterName}). Visual proof, formula derivation & board exam solved problems by Alka Ma'am.`
    : `${sim.description} Visual math proof, formula derivation & board exam solved problems by Alka Ma'am.`;

  // Build Breadcrumb JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Math Time Lab',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: sim.grade,
        item: `${BASE_URL}/#${sim.grade.toLowerCase().replace(/\s+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: sim.category,
        item: `${BASE_URL}/#${sim.category.toLowerCase().replace(/\s+/g, '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: sim.title,
        item: simUrl,
      },
    ],
  };

  // Build LearningResource JSON-LD
  const learningResourceLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: sim.title,
    description: sim.description,
    url: simUrl,
    learningResourceType: 'Interactive Simulation',
    educationalLevel: sim.grade,
    teaches: sim.keyConcepts.join(', '),
    author: {
      '@type': 'Person',
      name: "Alka Sharma (Alka Ma'am)",
      jobTitle: 'Mathematics Educator',
      url: 'https://itsmathtime.co.in/',
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'MathTime',
      url: 'https://itsmathtime.co.in/',
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Math Time Lab',
      url: BASE_URL,
    },
  };

  if (ncert) {
    learningResourceLd.educationalAlignment = {
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: `NCERT Class ${ncert.gradeNumber} Chapter ${ncert.chapterNumber}: ${ncert.chapterName}`,
    };
  }

  // Build FAQPage JSON-LD if doubts exist
  let faqLd: Record<string, any> | null = null;
  if (sim.doubts && sim.doubts.length > 0) {
    faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: sim.doubts.map((d) => ({
        '@type': 'Question',
        name: d.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: d.latex ? `${d.answer} Formula: ${d.latex}` : d.answer,
        },
      })),
    };
  }

  // Semantic Pre-Rendered DOM for <div id="root">
  const prerenderedBody = `
    <main style="max-width: 980px; margin: 0 auto; padding: 24px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f8fafc; background: #020617; line-height: 1.6;">
      <nav aria-label="Breadcrumb" style="font-size: 13px; color: #94a3b8; margin-bottom: 14px;">
        <a href="/" style="color: #38bdf8; text-decoration: none;">Math Time Lab</a> &gt;
        <span>${escapeHtml(sim.grade)}</span> &gt;
        <span>${escapeHtml(sim.category)}</span> &gt;
        <span style="color: #f8fafc;">${escapeHtml(sim.title)}</span>
      </nav>

      <header style="border-bottom: 1px solid #1e293b; padding-bottom: 18px; margin-bottom: 24px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">
          <span style="background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.4); color: #38bdf8; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 6px;">${escapeHtml(sim.grade)}</span>
          ${ncert ? `<span style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #4ade80; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 6px;">NCERT Ch ${ncert.chapterNumber}: ${escapeHtml(ncert.chapterName)} (${escapeHtml(ncert.exerciseRef)})</span>` : ''}
          <span style="color: #94a3b8; font-size: 11px; padding: 3px 0;">${escapeHtml(sim.category)} • CBSE • ICSE • State Boards</span>
        </div>
        <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; margin: 0 0 10px 0;">${escapeHtml(sim.title)}</h1>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 0;">${escapeHtml(sim.description)}</p>
      </header>

      <!-- Governing Mathematical Law -->
      <section style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0;">Governing Mathematical Law</h2>
        <div style="font-family: monospace; font-size: 16px; color: #a5f3fc; text-align: center; padding: 14px; background: #020617; border-radius: 8px; overflow-x: auto;">
          ${escapeHtml(sim.latexFormula || sim.formulaPreview || '')}
        </div>
      </section>

      <!-- Geometric & First-Principle Intuition -->
      <section style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 10px 0;">Geometric &amp; First-Principle Intuition</h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7;">${escapeHtml(sim.theoryBreakdown)}</p>
      </section>

      <!-- Coach Secret & Misconception -->
      <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 16px;">
          <h3 style="font-size: 13px; font-weight: 700; color: #fbbf24; text-transform: uppercase; margin: 0 0 6px 0;">Alka Ma'am's Exam Shortcut</h3>
          <p style="font-size: 13px; color: #fef3c7; line-height: 1.5; margin: 0;">${escapeHtml(sim.coachSecret)}</p>
        </div>
        ${sim.textbookTrap ? `
        <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 12px; padding: 16px;">
          <h3 style="font-size: 13px; font-weight: 700; color: #fb7185; text-transform: uppercase; margin: 0 0 6px 0;">Common Textbook Trap</h3>
          <p style="font-size: 13px; color: #ffe4e6; line-height: 1.5; margin: 0;">${escapeHtml(sim.textbookTrap)}</p>
        </div>` : ''}
      </section>

      <!-- Step-by-Step Solved Board Exam Problem -->
      ${sim.solvedProblem ? `
      <section style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <span style="font-size: 11px; font-weight: bold; color: #4ade80; text-transform: uppercase;">${escapeHtml(sim.solvedProblem.examType)}</span>
        <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 4px 0 12px 0;">${escapeHtml(sim.solvedProblem.title)}</h2>
        <p style="font-size: 14px; color: #e2e8f0; font-weight: 600; margin-bottom: 16px;">${escapeHtml(sim.solvedProblem.question)}</p>
        <ol style="padding-left: 20px; margin: 0 0 16px 0; color: #cbd5e1; font-size: 13px; line-height: 1.7;">
          ${sim.solvedProblem.steps.map(st => `
            <li style="margin-bottom: 10px;">
              <strong>${escapeHtml(st.title)}:</strong> ${escapeHtml(st.explanation)}
              <div style="font-family: monospace; color: #a5f3fc; padding: 4px 8px; background: #020617; border-radius: 4px; margin-top: 4px;">${escapeHtml(st.latex || '')}</div>
            </li>
          `).join('')}
        </ol>
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 12px; color: #a7f3d0; font-size: 13px;">
          <strong>Final Verified Answer:</strong> ${escapeHtml(sim.solvedProblem.finalAnswer)}
        </div>
      </section>` : ''}

      <!-- Frequently Asked Concept Doubts (Q&A) -->
      ${sim.doubts && sim.doubts.length > 0 ? `
      <section style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 0 0 14px 0;">Frequently Asked Concept Doubts</h2>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${sim.doubts.map(d => `
            <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 14px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #38bdf8; margin: 0 0 6px 0;">Q: ${escapeHtml(d.question)}</h3>
              <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin: 0 0 6px 0;">${escapeHtml(d.answer)}</p>
              ${d.latex ? `<div style="font-family: monospace; color: #a5f3fc; font-size: 12px;">${escapeHtml(d.latex)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </section>` : ''}

      <!-- Prerequisites & Related Visual Simulators -->
      ${relatedSims.length > 0 ? `
      <section style="margin-bottom: 24px; background: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 18px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #38bdf8; margin: 0 0 12px 0;">Prerequisites &amp; Related Visual Labs</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
          ${relatedSims.map(rel => `
            <a href="/simulators/${rel.id}" style="display: block; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 12px; text-decoration: none; color: inherit;">
              <span style="display: inline-block; font-size: 10px; font-weight: bold; background: #1e293b; color: #38bdf8; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px;">${escapeHtml(rel.grade)}</span>
              <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">${escapeHtml(rel.shortTitle || rel.title)}</div>
              <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">${escapeHtml(rel.category)} • ${escapeHtml(rel.difficulty)}</div>
            </a>
          `).join('')}
        </div>
      </section>` : ''}

      <!-- Parent Site NCERT Bridge -->
      <section style="margin-bottom: 24px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
        <div>
          <h3 style="font-size: 14px; font-weight: 700; color: #34d399; margin: 0 0 4px 0;">itsmathtime.co.in Parent Portal Solutions</h3>
          <p style="font-size: 12px; color: #cbd5e1; margin: 0;">
            ${ncert ? `Access comprehensive NCERT exercises, step-by-step proofs, and video lectures for ${escapeHtml(ncert.chapterName)}.` : 'Access comprehensive NCERT exercises, step-by-step proofs, and video lectures.'}
          </p>
        </div>
        <a href="https://itsmathtime.co.in" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #059669; color: #ffffff; padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">Explore Notes &rarr;</a>
      </section>

      <!-- Footer & Parent Site Links -->
      <footer style="border-top: 1px solid #1e293b; padding-top: 18px; font-size: 13px; color: #94a3b8; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>Curated by <strong>Alka Sharma (Alka Ma'am)</strong> • <a href="https://itsmathtime.co.in/" style="color: #38bdf8; text-decoration: underline;">itsmathtime.co.in</a></div>
        <div><a href="/" style="color: #38bdf8; text-decoration: none;">&larr; Return to All 50 Simulators</a></div>
      </footer>
    </main>
  `;

  // Clone template HTML and replace metadata and body
  let html = templateHtml;

  // Replace Title
  html = html.replace(
    /<title>.*?<\/title>/s,
    `<title>${escapeHtml(pageTitle)}</title>`
  );

  // Replace Description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/s,
    `<meta name="description" content="${escapeHtml(metaDesc)}" />`
  );

  // Inject Canonical link
  const canonicalTag = `<link rel="canonical" href="${simUrl}" />`;
  html = html.replace('</head>', `    ${canonicalTag}\n  </head>`);

  // Replace OpenGraph & Twitter tags
  html = html.replace(
    /<meta property="og:title" content=".*?" \/>/s,
    `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content=".*?" \/>/s,
    `<meta property="og:description" content="${escapeHtml(metaDesc)}" />`
  );
  html = html.replace(
    /<meta property="og:url" content=".*?" \/>/s,
    `<meta property="og:url" content="${simUrl}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content=".*?" \/>/s,
    `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content=".*?" \/>/s,
    `<meta name="twitter:description" content="${escapeHtml(metaDesc)}" />`
  );

  // Inject JSON-LD Schema
  const schemas = [breadcrumbLd, learningResourceLd];
  if (faqLd) schemas.push(faqLd);
  const schemasHtml = schemas.map(s => `    <script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  html = html.replace('</head>', `${schemasHtml}\n  </head>`);

  // Inject prerendered body into <div id="root"></div>
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${prerenderedBody}</div>`
  );

  // Save to dist/simulators/[id]/index.html
  const simDir = path.join(DIST_DIR, 'simulators', sim.id);
  fs.mkdirSync(simDir, { recursive: true });
  fs.writeFileSync(path.join(simDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

// -----------------------------------------------------------------------------
// 2. Prerender /teacher (Educator Cockpit)
// -----------------------------------------------------------------------------
{
  const teacherUrl = `${BASE_URL}/teacher`;
  const teacherTitle = "Educator Cockpit & Curriculum Guide | Math Time Lab by Alka Ma'am";
  const teacherDesc = "Classroom smartboard presets, pedagogical inquiry prompts, and multi-board CBSE/ICSE curriculum alignment for mathematics educators.";

  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(teacherTitle)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(teacherDesc)}" />`);
  html = html.replace('</head>', `    <link rel="canonical" href="${teacherUrl}" />\n  </head>`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeHtml(teacherTitle)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${escapeHtml(teacherDesc)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${teacherUrl}" />`);

  const teacherDir = path.join(DIST_DIR, 'teacher');
  fs.mkdirSync(teacherDir, { recursive: true });
  fs.writeFileSync(path.join(teacherDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

// -----------------------------------------------------------------------------
// 3. Prerender /landing (Platform Overview)
// -----------------------------------------------------------------------------
{
  const landingUrl = `${BASE_URL}/landing`;
  const landingTitle = "Math Time Lab – Interactive 3D Math Platform for Classes 8–12";
  const landingDesc = "Touch-responsive, tactile 2D and 3D visual math labs designed by Alka Ma'am to banish textbook anxiety.";

  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(landingTitle)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(landingDesc)}" />`);
  html = html.replace('</head>', `    <link rel="canonical" href="${landingUrl}" />\n  </head>`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeHtml(landingTitle)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${escapeHtml(landingDesc)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${landingUrl}" />`);

  const landingDir = path.join(DIST_DIR, 'landing');
  fs.mkdirSync(landingDir, { recursive: true });
  fs.writeFileSync(path.join(landingDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

// -----------------------------------------------------------------------------
// 4. Prerender Grade-Level Hub Pages (Classes 8–12)
// -----------------------------------------------------------------------------
const grades: { gradeKey: GradeLevel; gradeNum: number; gradeName: string }[] = [
  { gradeKey: 'class-8', gradeNum: 8, gradeName: 'Class 8' },
  { gradeKey: 'class-9', gradeNum: 9, gradeName: 'Class 9' },
  { gradeKey: 'class-10', gradeNum: 10, gradeName: 'Class 10' },
  { gradeKey: 'class-11', gradeNum: 11, gradeName: 'Class 11' },
  { gradeKey: 'class-12', gradeNum: 12, gradeName: 'Class 12' },
];

for (const g of grades) {
  const gm = GRADE_METADATA[g.gradeKey]!;
  const gradeSims = SIMULATORS.filter(s => s.gradeNumber === g.gradeNum);
  const hubUrl = `${BASE_URL}${gm.path}`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Math Time Lab', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: `${g.gradeName} Math Simulators`, item: hubUrl }
    ]
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: gm.title,
    description: gm.description,
    url: hubUrl,
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'MathTime',
      url: 'https://itsmathtime.co.in'
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: gradeSims.length,
      itemListElement: gradeSims.map((s, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: s.title,
        url: `${BASE_URL}/simulators/${s.id}`
      }))
    }
  };

  const hubBody = `
    <main style="max-width: 1040px; margin: 0 auto; padding: 32px 20px; font-family: system-ui, -apple-system, sans-serif; color: #e2e8f0; line-height: 1.6;">
      <!-- Breadcrumbs -->
      <nav aria-label="Breadcrumb" style="font-size: 13px; margin-bottom: 20px; color: #94a3b8;">
        <a href="/" style="color: #38bdf8; text-decoration: none;">Math Time Lab</a> &rsaquo;
        <span style="color: #ffffff; font-weight: 600;">${escapeHtml(g.gradeName)} Math Simulators</span>
      </nav>

      <!-- Hub Header -->
      <header style="border-bottom: 1px solid #1e293b; padding-bottom: 24px; margin-bottom: 32px;">
        <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #34d399; letter-spacing: 0.05em;">CBSE &amp; NCERT Mathematics</span>
        <h1 style="font-size: 30px; font-weight: 800; color: #ffffff; margin: 8px 0 12px 0;">${escapeHtml(g.gradeName)} Mathematics Interactive Simulators &amp; Visual Labs</h1>
        <p style="font-size: 16px; color: #cbd5e1; max-width: 800px; margin: 0 0 16px 0;">${escapeHtml(gm.description)}</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; font-size: 13px;">
          <span style="background: #1e293b; padding: 6px 12px; border-radius: 6px; color: #38bdf8;"><strong>${gradeSims.length}</strong> Interactive Labs</span>
          <span style="background: #1e293b; padding: 6px 12px; border-radius: 6px; color: #34d399;">100% Free Open Educational Resource</span>
          <span style="background: #1e293b; padding: 6px 12px; border-radius: 6px; color: #fbbf24;">Curated by Alka Ma'am</span>
        </div>
      </header>

      <!-- Simulator Cards Grid -->
      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 20px;">All ${escapeHtml(g.gradeName)} Interactive Visual Labs</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px;">
          ${gradeSims.map(sim => {
            const ncert = (NCERT_CHAPTER_MAP as any)[sim.id];
            return `
              <article style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 11px; font-weight: bold; background: #1e293b; color: #38bdf8; padding: 3px 8px; border-radius: 6px;">${escapeHtml(sim.category)}</span>
                    ${ncert ? `<span style="font-size: 11px; color: #94a3b8;">Ch ${ncert.chapterNumber}</span>` : ''}
                  </div>
                  <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                    <a href="/simulators/${sim.id}" style="color: #ffffff; text-decoration: none;">${escapeHtml(sim.title)}</a>
                  </h3>
                  <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 14px; line-height: 1.5;">${escapeHtml(sim.description)}</p>
                  <div style="font-family: monospace; font-size: 13px; background: #020617; color: #a5f3fc; padding: 8px 12px; border-radius: 6px; margin-bottom: 14px; overflow-x: auto;">
                    ${escapeHtml(sim.latexFormula || sim.formulaPreview || '')}
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #1e293b;">
                  <span style="font-size: 12px; color: #64748b;">${sim.estimatedMinutes} mins • ${escapeHtml(sim.difficulty)}</span>
                  <a href="/simulators/${sim.id}" style="background: #0284c7; color: #ffffff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 6px; text-decoration: none;">Launch Lab &rarr;</a>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Pedagogical & Exam Advice -->
      <section style="background: #0b1120; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #38bdf8; margin: 0 0 10px 0;">Alka Ma'am's ${escapeHtml(g.gradeName)} Study Blueprint</h2>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 12px;">
          In ${escapeHtml(g.gradeName)}, rote formula memorization collapses under multi-concept board exam problems. Use these visual laboratories to touch and manipulate coordinates, angles, and invariants BEFORE solving textbook exercises.
        </p>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin: 0;">
          Need complete step-by-step textbook solutions, proof videos, and revision notes? Visit our parent educational portal: <a href="https://itsmathtime.co.in" target="_blank" rel="noopener noreferrer" style="color: #34d399; font-weight: 700; text-decoration: underline;">itsmathtime.co.in</a>.
        </p>
      </section>

      <!-- Footer Navigation -->
      <footer style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 13px; color: #94a3b8; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>Curated by <strong>Alka Sharma (Alka Ma'am)</strong> • <a href="https://itsmathtime.co.in/" style="color: #38bdf8; text-decoration: underline;">itsmathtime.co.in</a></div>
        <div><a href="/" style="color: #38bdf8; text-decoration: none;">&larr; Return to All 50 Simulators</a></div>
      </footer>
    </main>
  `;

  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(gm.title)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(gm.description)}" />`);
  html = html.replace('</head>', `    <link rel="canonical" href="${hubUrl}" />\n  </head>`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeHtml(gm.title)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${escapeHtml(gm.description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${hubUrl}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${escapeHtml(gm.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${escapeHtml(gm.description)}" />`);

  const schemasHtml = [breadcrumbLd, collectionLd].map(s => `    <script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  html = html.replace('</head>', `${schemasHtml}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${hubBody}</div>`);

  // Save to dist/classes/class-X-math-simulators/index.html
  const hubDir = path.join(DIST_DIR, 'classes', `${g.gradeKey}-math-simulators`);
  fs.mkdirSync(hubDir, { recursive: true });
  fs.writeFileSync(path.join(hubDir, 'index.html'), html, 'utf8');
  generatedCount++;

  // Also save shorthand alias dist/classes/class-X/index.html
  const shortHubDir = path.join(DIST_DIR, 'classes', g.gradeKey);
  fs.mkdirSync(shortHubDir, { recursive: true });
  fs.writeFileSync(path.join(shortHubDir, 'index.html'), html, 'utf8');
  generatedCount++;
}

console.log(`[Prerender] ✅ Successfully generated ${generatedCount} static prerendered HTML pages!`);


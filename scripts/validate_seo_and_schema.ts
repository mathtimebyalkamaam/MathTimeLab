import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');

interface ValidationResult {
  file: string;
  url: string;
  canonical: string;
  hasValidCanonical: boolean;
  title: string;
  description: string;
  jsonLdCount: number;
  schemas: string[];
  hasLearningResource: boolean;
  hasWebPage: boolean;
  hasBreadcrumbs: boolean;
  hasFAQ: boolean;
  hasEducationalOrg: boolean;
  hasWebSite: boolean;
  hasMisleadingAppOrProduct: boolean;
  communicatesConcept: boolean;
  communicatesExploration: boolean;
  communicatesInputs: boolean;
  communicatesOutputs: boolean;
  communicatesOutcomes: boolean;
  errors: string[];
}

const results: ValidationResult[] = [];

function checkHtmlFile(filePath: string, relativeUrl: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors: string[] = [];

  // 1. Check title
  const titleMatch = content.match(/<title>(.*?)<\/title>/s);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (!title) errors.push('Missing <title>');

  // 2. Check meta description
  const descMatch = content.match(/<meta name="description" content="(.*?)" \/>/s);
  const description = descMatch ? descMatch[1].trim() : '';
  if (!description) errors.push('Missing <meta name="description">');

  // 3. Check canonical
  const canonicalMatch = content.match(/<link rel="canonical" href="(.*?)" \/>/);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';
  const expectedPrefix = 'https://labs.itsmathtime.co.in';
  const hasValidCanonical = canonical.startsWith(expectedPrefix);
  if (!hasValidCanonical) errors.push(`Invalid canonical: ${canonical}`);

  // 4. Parse all JSON-LD blocks
  const scriptRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  let match;
  const schemas: string[] = [];
  let hasLearningResource = false;
  let hasWebPage = false;
  let hasBreadcrumbs = false;
  let hasFAQ = false;
  let hasEducationalOrg = false;
  let hasWebSite = false;
  let hasMisleadingAppOrProduct = false;
  let communicatesConcept = false;
  let communicatesExploration = false;
  let communicatesInputs = false;
  let communicatesOutputs = false;
  let communicatesOutcomes = false;
  let jsonLdCount = 0;

  // Check Google Analytics Tag (must match parent website https://itsmathtime.co.in)
  const hasGtag = content.includes('https://www.googletagmanager.com/gtag/js?id=G-F63R3HSRKQ') &&
                  content.includes("gtag('config', 'G-F63R3HSRKQ')");
  if (!hasGtag) {
    errors.push('Missing Google Analytics tag G-F63R3HSRKQ (must match parent https://itsmathtime.co.in)');
  }

  while ((match = scriptRegex.exec(content)) !== null) {
    jsonLdCount++;
    try {
      const data = JSON.parse(match[1]);
      if (data['@context'] !== 'https://schema.org') {
        errors.push(`Invalid @context: ${data['@context']}`);
      }

      const entities = data['@graph'] ? data['@graph'] : [data];
      for (const ent of entities) {
        const type = ent['@type'];
        schemas.push(type);

        if (type === 'SoftwareApplication' || type === 'WebApplication' || type === 'Product' || type === 'Review' || type === 'AggregateRating') {
          hasMisleadingAppOrProduct = true;
          errors.push(`Disallowed misleading type found: ${type}`);
        }

        if (type === 'EducationalOrganization') hasEducationalOrg = true;
        if (type === 'WebSite') hasWebSite = true;
        if (type === 'WebPage') hasWebPage = true;
        if (type === 'BreadcrumbList') hasBreadcrumbs = true;
        if (type === 'FAQPage') hasFAQ = true;

        if (type === 'LearningResource') {
          hasLearningResource = true;
          if (ent.teaches) communicatesConcept = true;
          if (ent.description) communicatesExploration = true;

          if (ent.about && Array.isArray(ent.about)) {
            for (const item of ent.about) {
              const name = item.name || '';
              if (name.includes('Principles') || name.includes('Concept')) communicatesConcept = true;
              if (name.includes('Exploration')) communicatesExploration = true;
              if (name.includes('Inputs') || name.includes('Controls')) communicatesInputs = true;
              if (name.includes('Outputs')) communicatesOutputs = true;
              if (name.includes('Outcomes')) communicatesOutcomes = true;
            }
          }
        }
      }
    } catch (e: any) {
      errors.push(`Malformed JSON-LD: ${e.message}`);
    }
  }

  results.push({
    file: path.relative(DIST_DIR, filePath),
    url: relativeUrl,
    canonical,
    hasValidCanonical,
    title,
    description,
    jsonLdCount,
    schemas,
    hasLearningResource,
    hasWebPage,
    hasBreadcrumbs,
    hasFAQ,
    hasEducationalOrg,
    hasWebSite,
    hasMisleadingAppOrProduct,
    communicatesConcept,
    communicatesExploration,
    communicatesInputs,
    communicatesOutputs,
    communicatesOutcomes,
    errors
  });
}

// Check root index.html
checkHtmlFile(path.join(DIST_DIR, 'index.html'), '/');

// Check /teacher
if (fs.existsSync(path.join(DIST_DIR, 'teacher', 'index.html'))) {
  checkHtmlFile(path.join(DIST_DIR, 'teacher', 'index.html'), '/teacher');
}

// Check /landing
if (fs.existsSync(path.join(DIST_DIR, 'landing', 'index.html'))) {
  checkHtmlFile(path.join(DIST_DIR, 'landing', 'index.html'), '/landing');
}

// Check /classes/*
const classesDir = path.join(DIST_DIR, 'classes');
if (fs.existsSync(classesDir)) {
  for (const dir of fs.readdirSync(classesDir)) {
    const p = path.join(classesDir, dir, 'index.html');
    if (fs.existsSync(p)) {
      checkHtmlFile(p, `/classes/${dir}`);
    }
  }
}

// Check /simulators/*
const simsDir = path.join(DIST_DIR, 'simulators');
if (fs.existsSync(simsDir)) {
  for (const dir of fs.readdirSync(simsDir)) {
    const p = path.join(simsDir, dir, 'index.html');
    if (fs.existsSync(p)) {
      checkHtmlFile(p, `/simulators/${dir}`);
    }
  }
}

console.log(`\n================================================================`);
console.log(`STRUCTURED DATA & SEO AUDIT VALIDATION REPORT`);
console.log(`================================================================`);
console.log(`Total HTML Pages Audited: ${results.length}`);

const simulatorResults = results.filter(r => r.url.startsWith('/simulators/'));
console.log(`Total Simulator Pages Audited: ${simulatorResults.length}`);

let totalErrors = 0;
for (const r of results) {
  if (r.errors.length > 0) {
    console.error(`❌ [${r.file}]:`, r.errors);
    totalErrors += r.errors.length;
  }
}

const missingAppCount = results.filter(r => r.hasMisleadingAppOrProduct).length;
console.log(`Misleading SoftwareApplication / Product / Fake Rating Count: ${missingAppCount} (0 expected)`);

const completeSims = simulatorResults.filter(r => 
  r.hasLearningResource &&
  r.hasWebPage &&
  r.hasBreadcrumbs &&
  r.communicatesConcept &&
  r.communicatesExploration &&
  r.communicatesInputs &&
  r.communicatesOutputs &&
  r.communicatesOutcomes
);

console.log(`Simulators with complete 5-point Educational Communication & Schema: ${completeSims.length} / ${simulatorResults.length}`);
console.log(`Total Validation Errors: ${totalErrors}`);

// Check robots.txt
const robots = fs.readFileSync('public/robots.txt', 'utf8');
console.log('\n--- robots.txt checks ---');
console.log('Includes Sitemap:', robots.includes('Sitemap: https://labs.itsmathtime.co.in/sitemap.xml'));
console.log('Allows Googlebot:', robots.includes('User-agent: Googlebot'));
console.log('Allows AI Bots (GPTBot, PerplexityBot, ClaudeBot):', 
  robots.includes('User-agent: GPTBot') && 
  robots.includes('User-agent: PerplexityBot') && 
  robots.includes('User-agent: ClaudeBot')
);
console.log('Disallows duplicate query params:', robots.includes('Disallow: /*?*'));

// Check sitemap.xml
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const locMatches = sitemap.match(/<loc>(.*?)<\/loc>/g) || [];
const totalLocs = locMatches.length;
const nonLabsUrls = locMatches.map(m => m.replace(/<\/?loc>/g, '')).filter(url => !url.startsWith('https://labs.itsmathtime.co.in'));
console.log('\n--- sitemap.xml checks ---');
console.log(`Total URLs in sitemap: ${totalLocs}`);
console.log('All URLs start with https://labs.itsmathtime.co.in:', nonLabsUrls.length === 0);
if (nonLabsUrls.length > 0) {
  console.error('Non-labs URLs found in sitemap:', nonLabsUrls);
}

// Check Google Analytics Tag
const allHaveGA = results.every(r => !r.errors.some(e => e.includes('Google Analytics')));
console.log('\n--- Google Analytics (gtag.js) checks ---');
console.log('Parent Tag ID: G-F63R3HSRKQ (matches https://itsmathtime.co.in)');
console.log(`Present on all ${results.length} HTML pages:`, allHaveGA);

if (totalErrors === 0 && completeSims.length === 50) {
  console.log('\n✅ ALL STRUCTURED DATA AND SEO CHECKS PASSED PERFECTLY (100% VALID)!');
} else {
  console.error('\n❌ ISSUES DETECTED!');
  process.exit(1);
}

import { AppRoute, SimulatorId, GradeLevel } from '../types/simulators';
import { SIMULATORS } from '../data/simulators';
import { NCERT_CHAPTER_MAP } from '../data/ncertMappings';
import { SIMULATOR_GUIDES } from '../data/guides';

const DEFAULT_TITLE = "Math Time Lab – 50+ Interactive Simulators | itsmathtime.co.in by Alka Ma'am";
const DEFAULT_DESC = "Official Interactive Math Simulator Division of itsmathtime.co.in by Alka Ma'am. Mobile-first, touch-responsive 3D and 2D math simulators for Classes 8–12: Algebra Tiles, Balance Scale, Conic Sections, Calculus, and 3D Geometry.";
const BASE_URL = 'https://labs.itsmathtime.co.in';

export const GRADE_METADATA: Record<GradeLevel, { title: string; description: string; path: string; label: string; gradeNumber: number } | null> = {
  'all': null,
  'class-8': {
    title: "Class 8 Maths Interactive Simulators & NCERT Visual Labs | Math Time Lab",
    description: "Explore 10 interactive Class 8 mathematics labs: Linear Equations Balance Scale, Algebraic Tiles, Compound Interest, Pythagorean Triplets, and Euler Polyhedra 3D.",
    path: '/classes/class-8-math-simulators',
    label: 'Class 8',
    gradeNumber: 8,
  },
  'class-9': {
    title: "Class 9 Maths Interactive Simulators & NCERT Visual Labs | Math Time Lab",
    description: "Master CBSE Class 9 Math with 10 visual simulators: Drone Navigator Distance Formula, Heron's Formula, Polynomial Factorizer, Lines & Angles, and Circle Theorems.",
    path: '/classes/class-9-math-simulators',
    label: 'Class 9',
    gradeNumber: 9,
  },
  'class-10': {
    title: "Class 10 Maths Interactive Simulators & NCERT Visual Labs | Math Time Lab",
    description: "Interactive Class 10 CBSE Math simulators: Quadratic Roots Hunter, Trigonometry Heights & Distances, Circle Tangents, Section Formula, and Similar Triangles.",
    path: '/classes/class-10-math-simulators',
    label: 'Class 10',
    gradeNumber: 10,
  },
  'class-11': {
    title: "Class 11 Maths Interactive Simulators & NCERT Visual Labs | Math Time Lab",
    description: "Tactile Class 11 visual math labs: 3D Conic Sections Slicer, Unit Circle & Trigonometric Waves, Limits & Tangents, Linear Inequalities, and Permutations.",
    path: '/classes/class-11-math-simulators',
    label: 'Class 11',
    gradeNumber: 11,
  },
  'class-12': {
    title: "Class 12 Maths Interactive Simulators & NCERT Visual Labs | Math Time Lab",
    description: "CBSE & JEE Class 12 Math labs: Calculus Sandbox, 3D Vector Flight Lab, Argand Plane Complex Numbers, FTC Integrals, Bayes Theorem, and Matrix Machine.",
    path: '/classes/class-12-math-simulators',
    label: 'Class 12',
    gradeNumber: 12,
  },
};

/**
 * Extracts a GradeLevel from URL pathname if matching /classes/class-(8|9|10|11|12).
 */
export function getGradeFromUrl(): GradeLevel | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/^\/classes\/(class-(?:8|9|10|11|12))(-math-simulators)?/);
  if (match) {
    return match[1] as GradeLevel;
  }
  return null;
}

/**
 * Parses the current browser location to resolve the target AppRoute.
 * Supports:
 *  - Clean paths: /simulators/:id, /landing, /teacher, /classes/class-:id
 *  - Query parameters: ?sim=:id
 *  - Hash routes: #/sim/:id or #:id
 */
export function getRouteFromUrl(): AppRoute {
  if (typeof window === 'undefined') return 'home';

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?(sim\/)?/, '');

  // 1. Check query parameter ?sim=id
  const simParam = searchParams.get('sim');
  if (simParam && isValidSimulatorId(simParam)) {
    return simParam as SimulatorId;
  }

  // 2. Check path /simulators/:id
  const simMatch = pathname.match(/^\/simulators\/([a-z0-9-]+)/);
  if (simMatch && isValidSimulatorId(simMatch[1])) {
    return simMatch[1] as SimulatorId;
  }

  // 3. Check hash fallback
  if (hash && isValidSimulatorId(hash)) {
    return hash as SimulatorId;
  }

  // 4. Check grade hub paths /classes/class-(8|9|10|11|12)
  if (getGradeFromUrl()) {
    return 'home';
  }

  // 5. Static core views
  if (pathname === '/teacher' || hash === 'teacher') return 'teacher';
  if (pathname === '/landing' || hash === 'landing') return 'landing';

  return 'home';
}

function isValidSimulatorId(id: string): boolean {
  return SIMULATORS.some((s) => s.id === id);
}

/**
 * Updates browser history, page title, meta tags, canonical link, and JSON-LD schema dynamically.
 */
export function syncRouteSeo(route: AppRoute, replace = false, grade?: GradeLevel) {
  if (typeof window === 'undefined') return;

  const isSim = route !== 'home' && route !== 'teacher' && route !== 'landing';
  let targetPath = '/';
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESC;
  let canonicalUrl = BASE_URL + '/';

  if (route === 'teacher') {
    targetPath = '/teacher';
    title = "Educator Cockpit & Curriculum Guide | Math Time Lab by Alka Ma'am";
    description = "Teacher cockpit, live smartboard projection presets, classroom inquiry prompts, and CBSE curriculum alignment for Classes 8–12.";
    canonicalUrl = `${BASE_URL}/teacher`;
  } else if (route === 'landing') {
    targetPath = '/landing';
    title = "Math Time Lab – Interactive 3D Math Platform for Classes 8–12";
    description = "Touch-responsive, tactile 2D and 3D visual math labs designed by Alka Ma'am to banish textbook anxiety.";
    canonicalUrl = `${BASE_URL}/landing`;
  } else if (isSim) {
    targetPath = `/simulators/${route}`;
    canonicalUrl = `${BASE_URL}/simulators/${route}`;

    const metadata = SIMULATORS.find((s) => s.id === route);
    const ncert = NCERT_CHAPTER_MAP[route as SimulatorId];

    if (metadata) {
      const ncertBadge = ncert ? ` | Class ${ncert.gradeNumber} Ch ${ncert.chapterNumber}` : ` | ${metadata.grade}`;
      title = `${metadata.title}${ncertBadge} – Math Time Lab`;
      description = `${metadata.description} Explore visual proof, formulas, and NCERT exam questions with Alka Ma'am.`;
    }
  } else if (grade && grade !== 'all' && GRADE_METADATA[grade]) {
    const gm = GRADE_METADATA[grade]!;
    targetPath = gm.path;
    title = gm.title;
    description = gm.description;
    canonicalUrl = `${BASE_URL}${gm.path}`;
  }

  // Synchronize browser URL bar without triggering page reloads
  try {
    const currentPath = window.location.pathname;
    if (currentPath !== targetPath && !(currentPath === '/' && targetPath === '/')) {
      if (replace) {
        window.history.replaceState({ route, grade }, title, targetPath);
      } else {
        window.history.pushState({ route, grade }, title, targetPath);
      }
    }
  } catch (err) {
    console.warn('[SEO] Failed to update history state:', err);
  }

  // Update DOM Meta Tags
  document.title = title;

  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'robots', 'index, follow');
  updateMetaTag('property', 'og:title', title);
  updateMetaTag('property', 'og:description', description);
  updateMetaTag('property', 'og:url', canonicalUrl);
  updateMetaTag('name', 'twitter:title', title);
  updateMetaTag('name', 'twitter:description', description);

  // Update Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  // Inject or update Schema.org JSON-LD
  updateStructuredData(route, title, description, canonicalUrl, grade);
}

function updateMetaTag(keyType: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${keyType}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(keyType, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateStructuredData(route: AppRoute, title: string, description: string, url: string, grade?: GradeLevel) {
  const SCRIPT_ID = 'math-time-dynamic-ldjson';
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const isSim = route !== 'home' && route !== 'teacher' && route !== 'landing';

  if (isSim) {
    const metadata = SIMULATORS.find((s) => s.id === route);
    const ncert = NCERT_CHAPTER_MAP[route as SimulatorId];
    const guide = SIMULATOR_GUIDES[route as SimulatorId];
    const gradeNum = metadata?.gradeNumber || 10;

    const graph: any[] = [];

    // 1. WebPage Schema
    graph.push({
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url: url,
      name: metadata?.title || title,
      description: guide?.introduction || description,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'Math Time Lab',
        url: BASE_URL,
      },
      breadcrumb: {
        '@id': `${url}#breadcrumb`,
      },
      mainEntity: {
        '@id': `${url}#learningresource`,
      },
    });

    // 2. BreadcrumbList Schema
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
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
          name: `${metadata?.grade || 'Class 10'} Math Simulators`,
          item: `${BASE_URL}/classes/class-${gradeNum}-math-simulators`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: metadata?.category || 'Mathematics',
          item: `${BASE_URL}/#${(metadata?.category || 'mathematics').toLowerCase().replace(/\s+/g, '-')}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: metadata?.title || title,
          item: url,
        },
      ],
    });

    // 3. LearningResource Schema
    const simSchema: Record<string, any> = {
      '@type': 'LearningResource',
      '@id': `${url}#learningresource`,
      name: guide?.h1Heading || metadata?.title || title,
      description: guide?.introduction || description,
      url: url,
      learningResourceType: 'Interactive Simulation',
      educationalLevel: metadata?.grade || 'CBSE High School',
      inLanguage: 'en',
      teaches: metadata?.keyConcepts?.join(', ') || 'Mathematics',
      educationalUse: ['Interactive Simulation', 'Conceptual Demonstration', 'Guided Practice'],
      author: {
        '@type': 'Person',
        '@id': 'https://itsmathtime.co.in/#author',
        name: "Alka Sharma (Alka Ma'am)",
        jobTitle: 'Mathematics Educator',
        url: 'https://itsmathtime.co.in',
        sameAs: ['https://www.youtube.com/@its.mathtime'],
      },
      publisher: {
        '@type': 'EducationalOrganization',
        '@id': `${BASE_URL}/#organization`,
        name: 'Math Time',
        url: 'https://itsmathtime.co.in',
      },
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'Math Time Lab',
        url: BASE_URL,
      },
      about: [
        {
          '@type': 'Thing',
          name: 'Mathematical Principles Taught',
          description: guide?.mathematicalPrinciples?.map((p: any) => `${p.title}: ${p.description}`).join('; ') || metadata?.keyConcepts?.join(', '),
        },
        {
          '@type': 'Thing',
          name: 'Interactive Exploration Scope',
          description: guide?.introduction || metadata?.description,
        },
        {
          '@type': 'Thing',
          name: 'Available Simulator Inputs & Controls',
          description: guide?.controlsGuide?.map((c: any) => `${c.name} (${c.type}${c.range ? `, range: ${c.range}` : ''}): ${c.effect}`).join('; ') || 'Interactive canvas and control sliders',
        },
        {
          '@type': 'Thing',
          name: 'Expected Mathematical Outputs',
          description: guide?.expectedOutput || 'Live visual recalculation and mathematical telemetry readout',
        },
        {
          '@type': 'Thing',
          name: 'Supported Learning Outcomes',
          description: guide?.learningObjectives?.join('; ') || metadata?.keyConcepts?.join(', '),
        },
      ],
      ...(ncert && {
        educationalAlignment: {
          '@type': 'AlignmentObject',
          alignmentType: 'educationalSubject',
          targetName: `NCERT Class ${ncert.gradeNumber} Chapter ${ncert.chapterNumber}: ${ncert.chapterName} (${ncert.exerciseRef})`,
          educationalFramework: 'CBSE / NCERT Mathematics',
        },
      }),
    };
    graph.push(simSchema);

    // 4. FAQPage Schema for doubts/Q&As
    if (metadata?.doubts && metadata.doubts.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        isPartOf: {
          '@id': `${url}#webpage`,
        },
        mainEntity: metadata.doubts.map((d) => ({
          '@type': 'Question',
          name: d.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: d.latex ? `${d.answer} Formula: ${d.latex}` : d.answer,
          },
        })),
      });
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  } else if (grade && grade !== 'all' && GRADE_METADATA[grade]) {
    const gm = GRADE_METADATA[grade]!;
    const gradeSims = SIMULATORS.filter((s) => s.gradeNumber === gm.gradeNumber);
    const graph: any[] = [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Math Time Lab', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: `${gm.label} Math Simulators`, item: url },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: gm.title,
        description: gm.description,
        url: url,
        publisher: {
          '@type': 'EducationalOrganization',
          '@id': `${BASE_URL}/#organization`,
          name: 'Math Time',
          url: 'https://itsmathtime.co.in',
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: gradeSims.length,
          itemListElement: gradeSims.map((s, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: s.title,
            url: `${BASE_URL}/simulators/${s.id}`,
          })),
        },
      },
      {
        '@type': 'Article',
        headline: gm.title,
        description: gm.description,
        url: url,
        inLanguage: 'en',
        author: {
          '@type': 'Person',
          '@id': 'https://itsmathtime.co.in/#author',
          name: "Alka Sharma (Alka Ma'am)",
          jobTitle: 'Mathematics Educator',
          url: 'https://itsmathtime.co.in',
        },
        publisher: {
          '@type': 'EducationalOrganization',
          '@id': `${BASE_URL}/#organization`,
          name: 'Math Time',
          url: 'https://itsmathtime.co.in',
        },
      },
    ];
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  } else {
    const portalSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'EducationalOrganization',
          '@id': `${BASE_URL}/#organization`,
          name: 'Math Time',
          alternateName: 'Math Time Lab',
          url: 'https://itsmathtime.co.in/',
          logo: `${BASE_URL}/math-time-logo.png`,
          founder: {
            '@type': 'Person',
            '@id': 'https://itsmathtime.co.in/#author',
            name: 'Alka Sharma',
            alternateName: "Alka Ma'am",
            jobTitle: 'Senior Mathematics Educator',
            url: 'https://itsmathtime.co.in/',
            sameAs: ['https://www.youtube.com/@its.mathtime'],
          },
          description: 'Interactive mathematics education platform providing 50+ visual 3D and 2D laboratories covering CBSE and NCERT curricula for Classes 8–12.',
          sameAs: ['https://itsmathtime.co.in/', 'https://www.youtube.com/@its.mathtime'],
        },
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'Math Time Lab',
          url: BASE_URL,
          description: description,
          publisher: {
            '@id': `${BASE_URL}/#organization`,
          },
          inLanguage: 'en',
        },
        {
          '@type': 'WebPage',
          '@id': `${BASE_URL}/#webpage`,
          url: BASE_URL,
          name: title,
          description: description,
          isPartOf: {
            '@id': `${BASE_URL}/#website`,
          },
        },
      ],
    };
    script.textContent = JSON.stringify(portalSchema);
  }
}


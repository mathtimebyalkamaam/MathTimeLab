import { AppRoute, SimulatorId } from '../types/simulators';
import { SIMULATORS } from '../data/simulators';
import { NCERT_CHAPTER_MAP } from '../data/ncertMappings';

const DEFAULT_TITLE = "Math Time Lab – 50+ Interactive Simulators | itsmathtime.co.in by Alka Ma'am";
const DEFAULT_DESC = "Official Interactive Math Simulator Division of itsmathtime.co.in by Alka Ma'am. Mobile-first, touch-responsive 3D and 2D math simulators for Classes 8–12: Algebra Tiles, Balance Scale, Conic Sections, Calculus, and 3D Geometry.";
const BASE_URL = 'https://labs.itsmathtime.co.in';

/**
 * Parses the current browser location to resolve the target AppRoute.
 * Supports:
 *  - Clean paths: /simulators/:id, /landing, /teacher
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

  // 4. Static core views
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
export function syncRouteSeo(route: AppRoute, replace = false) {
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
  }

  // Synchronize browser URL bar without triggering page reloads
  try {
    const currentPath = window.location.pathname;
    if (currentPath !== targetPath && !(currentPath === '/' && targetPath === '/')) {
      if (replace) {
        window.history.replaceState({ route }, title, targetPath);
      } else {
        window.history.pushState({ route }, title, targetPath);
      }
    }
  } catch (err) {
    console.warn('[SEO] Failed to update history state:', err);
  }

  // Update DOM Meta Tags
  document.title = title;

  updateMetaTag('name', 'description', description);
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
  updateStructuredData(route, title, description, canonicalUrl);
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

function updateStructuredData(route: AppRoute, title: string, description: string, url: string) {
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

    const simSchema = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: metadata?.title || title,
      description: description,
      url: url,
      learningResourceType: 'Interactive Simulation',
      educationalLevel: metadata?.grade || 'CBSE High School',
      teaches: metadata?.keyConcepts?.join(', ') || 'Mathematics',
      author: {
        '@type': 'Person',
        name: "Alka Sharma (Alka Ma'am)",
        jobTitle: 'Mathematics Educator',
        url: 'https://itsmathtime.co.in',
      },
      publisher: {
        '@type': 'EducationalOrganization',
        name: 'MathTime',
        url: 'https://itsmathtime.co.in',
      },
      isPartOf: {
        '@type': 'WebSite',
        name: 'Math Time Lab',
        url: BASE_URL,
      },
      ...(ncert && {
        educationalAlignment: {
          '@type': 'AlignmentObject',
          alignmentType: 'educationalSubject',
          targetName: `NCERT Class ${ncert.gradeNumber} Chapter ${ncert.chapterNumber}: ${ncert.chapterName}`,
        },
      }),
    };
    script.textContent = JSON.stringify(simSchema);
  } else {
    const portalSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Math Time Lab',
      url: BASE_URL,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      author: {
        '@type': 'Person',
        name: "Alka Sharma (Alka Ma'am)",
        jobTitle: 'Mathematics Educator',
        url: 'https://itsmathtime.co.in',
      },
      description: description,
    };
    script.textContent = JSON.stringify(portalSchema);
  }
}


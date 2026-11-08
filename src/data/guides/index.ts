import { SimulatorId } from '../../types/simulators';
import { SimulatorGuide } from '../../types/simulatorGuides';
import { CLASS_8_GUIDES } from './class8Guides';
import { CLASS_9_GUIDES } from './class9Guides';
import { CLASS_10_GUIDES } from './class10Guides';
import { CLASS_11_GUIDES } from './class11Guides';
import { CLASS_12_GUIDES } from './class12Guides';

export * from '../../types/simulatorGuides';
export { CLASS_8_GUIDES } from './class8Guides';
export { CLASS_9_GUIDES } from './class9Guides';
export { CLASS_10_GUIDES } from './class10Guides';
export { CLASS_11_GUIDES } from './class11Guides';
export { CLASS_12_GUIDES } from './class12Guides';

/**
 * Master aggregation of comprehensive educational and SEO guides for all 50 Math Time simulators.
 * Covers full pedagogical specifications across Classes 8 through 12.
 */
export const SIMULATOR_GUIDES: Record<SimulatorId, SimulatorGuide> = {
  ...CLASS_8_GUIDES,
  ...CLASS_9_GUIDES,
  ...CLASS_10_GUIDES,
  ...CLASS_11_GUIDES,
  ...CLASS_12_GUIDES,
} as Record<SimulatorId, SimulatorGuide>;

/**
 * Helper to retrieve the comprehensive guide for any simulator ID with fallback safety.
 */
export function getSimulatorGuideById(simulatorId: SimulatorId): SimulatorGuide | undefined {
  return SIMULATOR_GUIDES[simulatorId];
}


/**
 * useAnalytics.ts: Generic, provider-agnostic behavioral analytics hook for LiveSimulators.
 * 
 * Design:
 * - Decouples simulation and UI components from any third-party SDK (PostHog, Plausible, GA4, Mixpanel).
 * - Enforces structured telemetry schemas for student interactions, simulator start/complete, errors, and struggle events.
 * - Current default adapter logs cleanly to console with structured formatting.
 * - Swap or augment adapters in `ANALYTICS_PROVIDERS` without touching any simulator code.
 */
import { useCallback, useRef } from 'react';
import { SimulatorId } from '../types/simulators';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined | object;
}

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  properties?: AnalyticsProperties;
}

/**
 * Interface that any production analytics backend must fulfill
 * (e.g. PostHogProvider, PlausibleProvider, GA4Provider).
 */
export interface AnalyticsProvider {
  name: string;
  track: (event: AnalyticsEvent) => void;
  identify?: (userId: string, traits?: AnalyticsProperties) => void;
}

/**
 * ConsoleLoggerProvider: Default development / baseline provider
 */
class ConsoleLoggerProvider implements AnalyticsProvider {
  name = 'ConsoleLogger';

  track(event: AnalyticsEvent) {
    if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
      const { eventName, timestamp, properties } = event;
      // Styled console group for clean debugging during simulation testing
      console.log(
        `%c[Analytics] %c${eventName} %c@ ${timestamp}`,
        'color: #38bdf8; font-weight: bold;',
        'color: #f59e0b; font-weight: 600;',
        'color: #94a3b8; font-size: 10px;',
        properties || {}
      );
    }
  }

  identify(userId: string, traits?: AnalyticsProperties) {
    console.log(
      `%c[Analytics:Identify] %cUser: ${userId}`,
      'color: #10b981; font-weight: bold;',
      'color: #ffffff;',
      traits || {}
    );
  }
}

/**
 * Future plug-and-play provider placeholders (e.g., PostHog or Plausible):
 * class PostHogProvider implements AnalyticsProvider { ... }
 * class PlausibleProvider implements AnalyticsProvider { ... }
 */

// Active provider registry (can be configured with multiple active providers)
const activeProviders: AnalyticsProvider[] = [new ConsoleLoggerProvider()];

export const registerAnalyticsProvider = (provider: AnalyticsProvider) => {
  activeProviders.push(provider);
};

export const clearAnalyticsProviders = () => {
  activeProviders.length = 0;
};

export const logAnalyticsError = (
  simulatorId: SimulatorId | string,
  errorMessage: string,
  errorDetails?: AnalyticsProperties
) => {
  const payload: AnalyticsEvent = {
    eventName: 'simulator_error',
    timestamp: new Date().toISOString(),
    properties: {
      simulatorId,
      errorMessage,
      ...errorDetails,
      url: typeof window !== 'undefined' ? window.location.href : '',
      screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    },
  };

  activeProviders.forEach((provider) => {
    try {
      provider.track(payload);
    } catch (err) {
      console.warn(`[AnalyticsProvider:${provider.name}] failed to track error event`, err);
    }
  });
};

export interface UseAnalyticsReturn {
  trackEvent: (eventName: string, properties?: AnalyticsProperties) => void;
  trackSimulatorStart: (simulatorId: SimulatorId | string, metadata?: AnalyticsProperties) => void;
  trackSimulatorComplete: (simulatorId: SimulatorId | string, score: number, metadata?: AnalyticsProperties) => void;
  trackError: (simulatorId: SimulatorId | string, errorMessage: string, errorDetails?: AnalyticsProperties) => void;
  trackStruggle: (simulatorId: SimulatorId | string, challengeId: string | number, attemptsCount: number, reason?: string) => void;
  trackParameterChange: (simulatorId: SimulatorId | string, paramName: string, paramValue: number | string | boolean) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const startTimeRef = useRef<number>(Date.now());

  const dispatchToProviders = useCallback((eventName: string, properties?: AnalyticsProperties) => {
    const payload: AnalyticsEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : '',
        screenSize: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
      },
    };

    activeProviders.forEach((provider) => {
      try {
        provider.track(payload);
      } catch (err) {
        console.warn(`[AnalyticsProvider:${provider.name}] failed to track event`, err);
      }
    });
  }, []);

  const trackEvent = useCallback(
    (eventName: string, properties?: AnalyticsProperties) => {
      dispatchToProviders(eventName, properties);
    },
    [dispatchToProviders]
  );

  const trackSimulatorStart = useCallback(
    (simulatorId: SimulatorId | string, metadata?: AnalyticsProperties) => {
      startTimeRef.current = Date.now();
      dispatchToProviders('simulator_start', {
        simulatorId,
        ...metadata,
      });
    },
    [dispatchToProviders]
  );

  const trackSimulatorComplete = useCallback(
    (simulatorId: SimulatorId | string, score: number, metadata?: AnalyticsProperties) => {
      const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      dispatchToProviders('simulator_complete', {
        simulatorId,
        score,
        timeSpentSeconds: elapsedSeconds,
        ...metadata,
      });
    },
    [dispatchToProviders]
  );

  const trackError = useCallback(
    (simulatorId: SimulatorId | string, errorMessage: string, errorDetails?: AnalyticsProperties) => {
      dispatchToProviders('simulator_error', {
        simulatorId,
        errorMessage,
        ...errorDetails,
      });
    },
    [dispatchToProviders]
  );

  const trackStruggle = useCallback(
    (
      simulatorId: SimulatorId | string,
      challengeId: string | number,
      attemptsCount: number,
      reason?: string
    ) => {
      dispatchToProviders('student_struggle_detected', {
        simulatorId,
        challengeId,
        attemptsCount,
        reason: reason || 'multiple_failed_attempts',
      });
    },
    [dispatchToProviders]
  );

  const trackParameterChange = useCallback(
    (
      simulatorId: SimulatorId | string,
      paramName: string,
      paramValue: number | string | boolean
    ) => {
      dispatchToProviders('simulator_param_changed', {
        simulatorId,
        paramName,
        paramValue,
      });
    },
    [dispatchToProviders]
  );

  return {
    trackEvent,
    trackSimulatorStart,
    trackSimulatorComplete,
    trackError,
    trackStruggle,
    trackParameterChange,
  };
};

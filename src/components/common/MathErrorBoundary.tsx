/**
 * MathErrorBoundary: Specialized React Error Boundary designed for real-time mathematics and physics.
 * Catches math singularities (divide-by-zero, sqrt of negatives in real space, infinite matrix tangents, 
 * NaN state mutations, impossible geometric sections) and provides friendly educational recovery.
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  ArrowLeft,
  Infinity as InfinityIcon
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { logAnalyticsError } from '../../hooks/useAnalytics';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  simulatorId?: string;
  resetKey?: string | number;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorType: 'divide_by_zero' | 'negative_sqrt' | 'nan_overflow' | 'singular_geometry' | 'module_load' | 'generic';
  showDetails: boolean;
}

export class MathErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorType: 'generic',
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    const msg = error?.message?.toLowerCase() || '';
    let errorType: State['errorType'] = 'generic';

    if (
      msg.includes('dynamically imported module') ||
      msg.includes('failed to fetch') ||
      msg.includes('loading chunk') ||
      msg.includes('chunkloaderror') ||
      msg.includes('importing a module script failed') ||
      msg.includes('networkerror') ||
      msg.includes('network error') ||
      msg.includes('load failed')
    ) {
      errorType = 'module_load';
    } else if (msg.includes('division by zero') || msg.includes('divide by zero') || msg.includes('/ 0') || msg.includes('infinity')) {
      errorType = 'divide_by_zero';
    } else if (msg.includes('sqrt') || msg.includes('square root') || msg.includes('negative')) {
      errorType = 'negative_sqrt';
    } else if (msg.includes('nan') || msg.includes('overflow') || msg.includes('rangeerror')) {
      errorType = 'nan_overflow';
    } else if (msg.includes('matrix') || msg.includes('degenerate') || msg.includes('singular') || msg.includes('conic')) {
      errorType = 'singular_geometry';
    }

    return {
      hasError: true,
      error,
      errorType,
      showDetails: false,
    };
  }

  public componentDidUpdate(prevProps: Props) {
    // Automatically reset error boundary if user navigated to a different simulator
    if (
      (this.props.simulatorId && this.props.simulatorId !== prevProps.simulatorId) ||
      (this.props.resetKey !== undefined && this.props.resetKey !== prevProps.resetKey)
    ) {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: null, errorType: 'generic', showDetails: false });
      }
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[MathErrorBoundary caught error]:', error, errorInfo);
    try {
      const activeSim = this.props.simulatorId || useSimulatorStore.getState().activeSimulatorId || 'global';
      logAnalyticsError(activeSim, error.message, {
        componentStack: errorInfo.componentStack,
        errorType: this.state.errorType,
      });
    } catch {}
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorType: 'generic', showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      try {
        const state = useSimulatorStore.getState();
        const simId = (this.props.simulatorId || state.activeSimulatorId) as any;
        if (simId) {
          state.resetParams(simId);
        }
      } catch {}
    }
  };

  private handleReloadModule = () => {
    this.setState({ hasError: false, error: null, errorType: 'generic', showDetails: false });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private getEducationalContent() {
    switch (this.state.errorType) {
      case 'module_load':
        return {
          badge: 'Module Synchronizing',
          title: 'Laboratory Module Load Interrupted',
          formula: '\\text{Status: Reconnecting Laboratory Engine}',
          explanation: 'The visual physics simulation module encountered a temporary network delay or browser cache refresh while loading over Wi-Fi / local network.',
          suggestion: 'Click "Reload Module" below to reconnect and download this laboratory immediately.',
          isModuleError: true,
        };
      case 'divide_by_zero':
        return {
          badge: 'Singularity: Division by Zero',
          title: 'Whoops! The Universe Almost Crashed',
          formula: 'f(x) = a / x \\to \\text{undefined as } x \\to 0',
          explanation: 'Dividing by zero is mathematically undefined because no real number multiplied by 0 can equal a non-zero numerator. In computer calculations, this yields ±Infinity.',
          suggestion: 'Adjust your slider or denominator parameter to any non-zero value (e.g. 0.1 or higher).',
          isModuleError: false,
        };
      case 'negative_sqrt':
        return {
          badge: 'Domain Error: Negative Radicand',
          title: 'Ventured into the Complex Plane',
          formula: '\\sqrt{-x} = i\\sqrt{x} \\notin \\mathbb{R}',
          explanation: 'In real Euclidean geometry, the square of any real number is non-negative. Taking the square root of a negative value requires imaginary numbers (i = √-1).',
          suggestion: 'Ensure your discriminant or height value remains positive, or adjust the origin.',
          isModuleError: false,
        };
      case 'singular_geometry':
        return {
          badge: 'Degenerate Conic Section',
          title: 'Degenerate Geometric Intersection',
          formula: '\\det(M) = 0 \\quad \\cdot \\quad B^2 - 4AC = 0',
          explanation: 'The cutting plane is passing directly through the apex vertex of the cone, collapsing the curve into a single point or intersecting pair of lines.',
          suggestion: 'Offset the laser plane height away from z = 0 or adjust the tilt angle.',
          isModuleError: false,
        };
      case 'nan_overflow':
      default:
        return {
          badge: 'Numerical Discontinuity',
          title: 'Math Telemetry Out of Bounds',
          formula: '\\lim_{x \\to c} f(x) = \\text{undefined}',
          explanation: 'The simulation encountered an asymptotic value or infinite slope that exceeded standard IEEE-754 floating point precision.',
          suggestion: 'Click below to restore default educational parameters and resume exploration.',
          isModuleError: false,
        };
    }
  }

  public render() {
    if (this.state.hasError) {
      const content = this.getEducationalContent();

      return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center p-4 sm:p-6 bg-slate-950 text-slate-100">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Ambient Radial Background Glow */}
            <div className="absolute -top-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
              <InfinityIcon className="w-7 h-7" />
            </div>

            {/* Pill Badge */}
            <span className="px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
              {content.badge}
            </span>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {content.title}
            </h3>

            {/* Mathematical Formula Block */}
            <div className="w-full mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 text-center font-bold">
              {content.formula}
            </div>

            {/* Educational Explanation */}
            <p className="text-xs text-slate-300 mt-3 leading-relaxed text-center">
              {content.explanation}
            </p>

            {/* Action Hint */}
            <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2 text-left text-[11px] text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{content.suggestion}</span>
            </div>

            {/* Recovery Buttons */}
            <div className="w-full grid grid-cols-2 gap-2 mt-5">
              {content.isModuleError ? (
                <button
                  type="button"
                  onClick={this.handleReloadModule}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-98 transition-all touch-manipulation cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload Module</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-98 transition-all touch-manipulation cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Parameters</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorType: 'generic' });
                  try {
                    useSimulatorStore.getState().navigateTo('home');
                  } catch {}
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors touch-manipulation cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>

            {/* Diagnostic Details Disclosure */}
            {this.state.error && (
              <div className="w-full mt-3 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline font-mono cursor-pointer transition-colors"
                >
                  {this.state.showDetails ? 'Hide Diagnostic Telemetry' : 'Show Diagnostic Telemetry'}
                </button>
                {this.state.showDetails && (
                  <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono text-left break-all max-h-28 overflow-y-auto no-scrollbar">
                    <p className="text-amber-400 font-bold mb-1">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-[9px] text-slate-500 whitespace-pre-wrap">
                        {this.state.error.stack.split('\n').slice(0, 4).join('\n')}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

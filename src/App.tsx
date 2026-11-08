/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { useSimulatorStore } from './store/useSimulatorStore';
import { AppLayout } from './components/layout/AppLayout';
import { SoundManager } from './components/common/SoundManager';
import { DynamicSimulatorLoader } from './components/common/DynamicSimulatorLoader';
import { MathErrorBoundary } from './components/common/MathErrorBoundary';
import { SimulatorId } from './types/simulators';

// Code-split flagship portal pages to drastically accelerate initial bundle load on mobile
const HomePage = lazy(() => import('./components/pages/HomePage').then((m) => ({ default: m.HomePage })));
const LandingPage = lazy(() => import('./components/pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const TeacherDashboard = lazy(() => import('./components/pages/TeacherDashboard').then((m) => ({ default: m.TeacherDashboard })));

const PageLoadingFallback: React.FC = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center p-8 bg-slate-950 text-slate-100 select-none">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      <span className="text-xs font-mono text-cyan-300">Loading Math Time Portal...</span>
    </div>
  </div>
);

export default function App() {
  const { currentRoute } = useSimulatorStore();

  const renderActiveView = () => {
    if (currentRoute === 'landing') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <LandingPage />
        </Suspense>
      );
    }
    if (currentRoute === 'home') {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <HomePage />
        </Suspense>
      );
    }
    if (currentRoute === 'teacher') {
      return (
        <MathErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            <TeacherDashboard />
          </Suspense>
        </MathErrorBoundary>
      );
    }
    // All heavy physics & 3D WebGL simulators loaded dynamically on-demand with MathErrorBoundary
    return <DynamicSimulatorLoader simulatorId={currentRoute as SimulatorId} />;
  };

  return (
    <SoundManager>
      <AppLayout>
        {renderActiveView()}
      </AppLayout>
    </SoundManager>
  );
}

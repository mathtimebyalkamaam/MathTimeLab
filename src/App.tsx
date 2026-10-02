/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSimulatorStore } from './store/useSimulatorStore';
import { AppLayout } from './components/layout/AppLayout';
import { SoundManager } from './components/common/SoundManager';
import { HomePage } from './components/pages/HomePage';
import { LandingPage } from './components/pages/LandingPage';
import { TeacherDashboard } from './components/pages/TeacherDashboard';
import { DynamicSimulatorLoader } from './components/common/DynamicSimulatorLoader';
import { MathErrorBoundary } from './components/common/MathErrorBoundary';
import { SimulatorId } from './types/simulators';

export default function App() {
  const { currentRoute } = useSimulatorStore();

  const renderActiveView = () => {
    if (currentRoute === 'landing') {
      return <LandingPage />;
    }
    if (currentRoute === 'home') {
      return <HomePage />;
    }
    if (currentRoute === 'teacher') {
      return (
        <MathErrorBoundary>
          <TeacherDashboard />
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

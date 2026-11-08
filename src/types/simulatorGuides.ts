import { SimulatorId } from './simulators';

export interface ControlParameterGuide {
  name: string;
  type: 'slider' | 'toggle' | 'stepper' | 'drag' | 'button' | string;
  range?: string;
  options?: string;
  description: string;
  effect: string;
}

export interface RealWorldApplication {
  domain?: string;
  title?: string;
  scenario?: string;
  mathematicalConnection?: string;
  field?: string;
  description?: string;
  example?: string;
}

export interface MathematicalPrinciple {
  title: string;
  description: string;
  formulaLatex?: string;
}

export interface SimulatorGuide {
  simulatorId: SimulatorId;
  h1Heading: string;
  introduction: string;
  learningObjectives: string[];
  mathematicalPrinciples: MathematicalPrinciple[];
  controlsGuide: ControlParameterGuide[];
  stepByStepInstructions: string[];
  expectedOutput: string;
  realWorldApplication: RealWorldApplication;
}

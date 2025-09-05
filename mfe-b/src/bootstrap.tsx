import React from 'react';
console.log('[mfeB] React', (React as any).version);  // should log 19.x

import { createRoot, Root } from 'react-dom/client';
import AppB from './AppB';

export type MountResult = { unmount: () => void };

export function mount(container: HTMLElement): MountResult {
  const root: Root = createRoot(container);
  root.render(<AppB />);
  return { unmount: () => root.unmount() };
}
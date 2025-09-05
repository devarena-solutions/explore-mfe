import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import AppA from './AppA';

export type MountResult = { unmount: () => void };

export function mount(container: HTMLElement): MountResult {
  const root: Root = createRoot(container);
  root.render(<AppA />);
  return { unmount: () => root.unmount() };
}
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import AppB from './AppB';

export type MountResult = { unmount: () => void };

export function mount(container: HTMLElement): MountResult {
  const root: Root = createRoot(container);
  root.render(<AppB />);
  return { unmount: () => root.unmount() };
}
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// ⚠️ This imports raw components from MFEs and renders them inside the host root
//    This collapses the boundary and causes cross‑provider leakage and tight coupling.
//import RemoteAppA from 'mfeA/App';
//import RemoteAppB from 'mfeB/App';

createRoot(document.getElementById('host-root')!).render(
  <>
    <App />
    {/* <RemoteAppA />
    <RemoteAppB /> */}
  </>
);
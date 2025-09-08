import React from 'react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import PageOne from './PageOne';
import PageTwo from './PageTwo';

export default function AppB() {
  return (
    <div style={{ padding: 12, border: '1px dashed #aaa' }}>
      <MemoryRouter>
        <strong>MFE B</strong>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link to="/">One</Link>
          <Link to="/two">Two</Link>
        </nav>
        <Routes>
          <Route path="/" element={<PageOne />} />
          <Route path="/two" element={<PageTwo />} />
        </Routes>
        <div>Rendered inside its own React root.</div>
      </MemoryRouter>
    </div>
  );
}
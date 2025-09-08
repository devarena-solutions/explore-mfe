import React from 'react';
import { MemoryRouter, Link, Routes, Route } from 'react-router-dom';
import PageOne from './PageOne';
import PageTwo from './PageTwo';

export default function AppA() {
  return (
    <div style={{ padding: 12, border: '1px dashed #aaa' }}>
      <MemoryRouter>
        <strong>MFE A</strong>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link to="/">One</Link>
          <Link to="/two">Two</Link>
        </nav>
        <Routes>
          <Route path="/" element={<PageOne />} />
          <Route path="/two" element={<PageTwo />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}
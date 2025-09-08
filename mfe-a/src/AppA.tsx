import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import PageOne from './PageOne';
import PageTwo from './PageTwo';

export default function AppA() {
  return (
    <div style={{ padding: 12, border: '1px dashed #aaa' }}>
      <strong>MFE A</strong>
      <nav style={{ display: 'flex', gap: 8 }}>
        <Link to="">One</Link>
        <Link to="two">Two</Link>
      </nav>
      <Routes>
        <Route index element={<PageOne />} />
        <Route path="two" element={<PageTwo />} />
      </Routes>
    </div>
  );
}
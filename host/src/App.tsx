// host/src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import { MicroFrontend } from "./MicroFrontend";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/a">MFE A</Link>
        <Link to="/b">MFE B (React 19)</Link>
      </nav>
      <Suspense fallback={<div>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a/*" element={<MicroFrontend remote="mfeA" />} />
          <Route path="/b/*" element={<MicroFrontend remote="mfeB" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

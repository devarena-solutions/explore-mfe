import React from "react";
console.log("[host] React", (React as any).version); // should log 18.x

import { createRoot } from "react-dom/client";
import App from "./App";

// Host owns its own root
createRoot(document.getElementById("host-root")!).render(<App />);

// React 18 remote shares the host scope
import("mfeA/mount").then(({ mount }) =>
  mount(document.getElementById("slot-a")!)
);

// React 19 remote uses its own share scope configured in webpack
import("mfeB/mount").then(({ mount }) =>
  mount(document.getElementById("slot-b")!)
);

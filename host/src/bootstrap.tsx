import React from "react";
console.log("[host] React", (React as any).version); // should log 18.x

import { createRoot } from "react-dom/client";
import App from "./App";

// Host owns its own root
createRoot(document.getElementById("host-root")!).render(<App />);

// Mount React 18 remote via normal dynamic import (shares the host scope)
import("mfeA/mount").then(({ mount }) =>
  mount(document.getElementById("slot-a")!)
);

// Manually load mfeB so it can use its React 19 share scope
(async () => {
  const url = "http://localhost:3002/remoteEntry.js";

  // Load remote container if not yet loaded
  if (!(window as any).mfeB) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.type = "text/javascript";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(s);
    });
  }

  // Initialise the correct share scope for React 19
  // @ts-ignore
  await __webpack_init_sharing__("react19");
  const container = (window as any).mfeB;
  // @ts-ignore
  await container.init(__webpack_share_scopes__["react19"]);

  const factory = await container.get("./mount");
  const { mount } = factory();
  mount(document.getElementById("slot-b")!);
})();

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Host owns its own root
createRoot(document.getElementById("host-root")!).render(<App />);

// ✅ Dynamic import remotes (lets MF init the share scope automatically)
(async () => {
  const { mount: mountA } = await import("mfeA/mount");
  const { mount: mountB } = await import("mfeB/mount");

  mountA(document.getElementById("slot-a")!);
  mountB(document.getElementById("slot-b")!);
})();

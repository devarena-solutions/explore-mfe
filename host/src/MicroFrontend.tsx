// host/src/MicroFrontend.tsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Configure each remote here.
 * - global: window variable set by the remote container (ModuleFederationPlugin `name`)
 * - url:    remoteEntry URL (used if the container isn't loaded yet)
 * - expose: exposed module to get (default: "./mount")
 * - scope:  share scope name; use "default" for same-major React, or "react19" etc for dual scopes
 */
const REMOTES = {
  mfeA: {
    global: "mfeA",
    url: "http://localhost:3001/remoteEntry.js",
    expose: "./mount",
    scope: "react18",
  },
  mfeB: {
    global: "mfeB",
    url: "http://localhost:3002/remoteEntry.js",
    expose: "./mount",
    scope: "react19", // 👈 custom scope for React 19 island
  },
} as const;

type RemoteKey = keyof typeof REMOTES;

async function loadRemoteEntry(url: string, globalVar: string) {
  if ((window as any)[globalVar]) return; // already loaded
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.type = "text/javascript";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(s);
  });
  if (!(window as any)[globalVar]) {
    throw new Error(`Remote container ${globalVar} did not initialize`);
  }
}

export function MicroFrontend({ remote }: { remote: RemoteKey }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unmount: undefined | (() => void);
    let alive = true;

    (async () => {
      try {
        const cfg = REMOTES[remote];

        // 1) Ensure the remote container script is present
        await loadRemoteEntry(cfg.url, cfg.global);

        // 2) Initialize the correct share scope (default or custom)
        // @ts-ignore
        await __webpack_init_sharing__(cfg.scope || "default");

        const container = (window as any)[cfg.global];
        // @ts-ignore
        await container.init(__webpack_share_scopes__[cfg.scope || "default"]);

        // 3) Get exposed module factory and call it
        const factory = await container.get(cfg.expose || "./mount");
        const { mount } = factory();

        // 4) Mount into our slot
        if (!alive || !ref.current) return;
        unmount = mount(ref.current).unmount;
      } catch (e) {
        setError(e as Error);
      }
    })();

    // Cleanup with microtask deferral (avoids “synchronously unmount” warning)
    return () => {
      alive = false;
      if (unmount) {
        const fn = unmount;
        unmount = undefined;
        (typeof queueMicrotask === "function" ? queueMicrotask : (cb: any) => setTimeout(cb, 0))(fn);
      }
    };
  }, [remote]);

  if (error) return <div style={{ color: "crimson" }}>Failed to load {remote}: {error.message}</div>;
  return <div ref={ref} style={{ minHeight: 200 }} />;
}

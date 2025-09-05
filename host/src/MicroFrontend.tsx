// host/src/MicroFrontend.tsx
import React, { useEffect, useRef, useState } from "react";

const REMOTES = {
  mfeA: { global: "mfeA", url: "http://localhost:3001/remoteEntry.js", expose: "./mount", scope: "react18" },
  mfeB: { global: "mfeB", url: "http://localhost:3002/remoteEntry.js", expose: "./mount", scope: "react19" },
} as const;

type RemoteKey = keyof typeof REMOTES;

async function loadRemoteEntry(url: string, globalVar: string) {
  if ((window as any)[globalVar]) return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url; s.async = true; s.type = "text/javascript";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${url}`));
    document.head.appendChild(s);
  });
  if (!(window as any)[globalVar]) throw new Error(`Remote container ${globalVar} did not initialize`);
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

        // Ensure container present
        await loadRemoteEntry(cfg.url, cfg.global);

        // IMPORTANT: init the correct share scope BEFORE get()
        // @ts-ignore
        await __webpack_init_sharing__(cfg.scope);
        const container = (window as any)[cfg.global];
        // @ts-ignore
        await container.init(__webpack_share_scopes__[cfg.scope]);

        // Now get the exposed module and execute its factory
        const factory = await container.get(cfg.expose);
        const { mount } = factory();

        if (!alive || !ref.current) return;
        unmount = mount(ref.current).unmount;
      } catch (e) {
        setError(e as Error);
      }
    })();

    // Defer unmount to avoid React warning during route swaps
    return () => {
      alive = false;
      if (unmount) {
        const fn = unmount; unmount = undefined;
        (typeof queueMicrotask === "function" ? queueMicrotask : (cb: any) => setTimeout(cb, 0))(fn);
      }
    };
  }, [remote]);

  if (error) return <div style={{ color: "crimson" }}>Failed to load {remote}: {error.message}</div>;
  return <div ref={ref} style={{ minHeight: 200 }} />;
}

// host/src/MicroFrontend.tsx
import React, { useEffect, useRef, useState } from "react";
import { loadRemote } from "./utils/loadMFE";

const REMOTES = {
  mfeA: {
    url: "http://localhost:3001/remoteEntry.js",
    scope: "mfeA",
    module: "./mount",
    shareScope: "react18",
  },
  mfeB: {
    url: "http://localhost:3002/remoteEntry.js",
    scope: "mfeB",
    module: "./mount",
    shareScope: "react19",
  },
} as const;

type RemoteKey = keyof typeof REMOTES;

export function MicroFrontend({ remote }: { remote: RemoteKey }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unmount: undefined | (() => void);
    let alive = true;

    (async () => {
      try {
        const cfg = REMOTES[remote];
        const { mount } = await loadRemote<{ mount: (el: HTMLElement) => { unmount: () => void } }>({
          url: cfg.url,
          scope: cfg.scope,
          module: cfg.module,
          shareScope: cfg.shareScope,
        });

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

type ShareScopeName = "default" | "react18" | "react19";

interface LoadRemoteOptions {
  url: string;
  scope: string;
  module: string;
  shareScope?: ShareScopeName;
}

export async function loadRemote<T = any>({
  url,
  scope,
  module,
  shareScope = "default",
}: LoadRemoteOptions): Promise<T> {
  // @ts-ignore: init share scope is injected by Module Federation runtime
  await __webpack_init_sharing__(shareScope);
  const container = await loadContainer(url, scope);
  // @ts-ignore: share scopes are also injected by MF runtime
  await container.init(__webpack_share_scopes__[shareScope]);
  const factory = await container.get(module);
  return factory();
}

function loadContainer(url: string, scope: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const existing = (window as any)[scope];
    if (existing) {
      resolve(existing);
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    script.onload = () => {
      const container = (window as any)[scope];
      if (container) {
        resolve(container);
      } else {
        reject(new Error(`Container ${scope} not found at ${url}`));
      }
    };
    script.onerror = () => reject(new Error(`Failed to load remote entry ${url}`));
    document.head.appendChild(script);
  });
}

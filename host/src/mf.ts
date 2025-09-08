type ShareScopeName = "default" | "react18" | "react19";

export async function loadRemote<T = any>({
  remote,
  exposed,
  shareScope = "default",
}: { remote: string; exposed: string; shareScope?: ShareScopeName }): Promise<T> {
  // @ts-ignore
  await __webpack_init_sharing__(shareScope);
  // @ts-ignore
  const container = (await (window as any)[remote]) ?? (await import(/* webpackIgnore: true */ remote));
  // @ts-ignore
  await container.init(__webpack_share_scopes__[shareScope]);
  const factory = await container.get(exposed);
  return factory();
}

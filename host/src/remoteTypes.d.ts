// host/src/remoteTypes.d.ts
declare module "mfeA/mount" {
    export type MountResult = { unmount: () => void };
    export function mount(container: HTMLElement): MountResult;
  }
  
  declare module "mfeB/mount" {
    export type MountResult = { unmount: () => void };
    export function mount(container: HTMLElement): MountResult;
  }
  
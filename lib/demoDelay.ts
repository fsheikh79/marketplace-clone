// DEMO: artificial delay to showcase skeleton loading — remove in
// production. Every read in this app is local (localStorage/in-memory) and
// would otherwise resolve instantly, so skeleton states would never
// actually be visible without this.
export const DEMO_LOADING_DELAY_MS = 250;

export function demoDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, DEMO_LOADING_DELAY_MS));
}

// Recently viewed product ids, persisted to localStorage. Client-only —
// there's no server-side session to key this by, and that's fine, it's
// meant to follow the browser.

const RECENTLY_VIEWED_KEY = "marketplace:recently-viewed";
const MAX_ITEMS = 10;

function read(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
}

export function getRecentlyViewedIds(): string[] {
  return read();
}

export function trackView(productId: string): void {
  const existing = read().filter((id) => id !== productId);
  write([productId, ...existing].slice(0, MAX_ITEMS));
}

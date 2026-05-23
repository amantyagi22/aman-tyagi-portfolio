export function register() {
  if (typeof globalThis === "undefined") {
    return;
  }

  if (!("localStorage" in globalThis)) {
    return;
  }

  try {
    delete (globalThis as { localStorage?: unknown }).localStorage;
  } catch {
    (globalThis as { localStorage?: unknown }).localStorage = undefined;
  }
}

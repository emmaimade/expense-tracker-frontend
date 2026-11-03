// After a deploy, the old build's code files no longer exist, so an open tab fails to load the
// next page ("Failed to fetch dynamically imported module"). A reload picks up the new build.
// The timestamp guard stops a reload loop if the failure has another cause.
const KEY = 'sw-chunk-reload-at';
const WINDOW_MS = 10 * 1000;

export const isChunkLoadError = (error) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk [\w-]+ failed/i.test(
    String(error?.message || error)
  );

/** Reload the page unless we already did so in the last few seconds. Returns true if it reloads. */
export const reloadOnce = () => {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < WINDOW_MS) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // Storage unavailable (private mode): still try a single reload
  }
  window.location.reload();
  return true;
};

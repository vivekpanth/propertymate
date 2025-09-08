// Lightweight prefetch to warm DNS/TLS and caches for next video
// On iOS/Android this small ranged GET often primes the pipeline
export async function prefetchVideo(url?: string): Promise<void> {
  if (!url) return;
  try {
    await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
    });
  } catch {
    // ignore prefetch errors to avoid impacting UX
  }
}



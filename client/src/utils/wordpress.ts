export function getVideoPartsFromWP(
  html: string,
  base = 'https://www.grapeceramics.se'
) {
  if (!html) return { src: '' };

  const absolutify = (u: string) => {
    try {
      return u ? new URL(u, base).href : '';
    } catch {
      return u || '';
    }
  };

  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const src =
      doc.querySelector('video')?.getAttribute('src') ||
      doc.querySelector('video source')?.getAttribute('src') ||
      '';
    return { src: absolutify(src) };
  }

  const videoSrcMatch =
    html.match(/<video[^>]*?\s(src|data-src)\s*=\s*["']([^"']+)["'][^>]*>/i) ||
    html.match(/<source[^>]*?\s(src|data-src)\s*=\s*["']([^"']+)["'][^>]*>/i);

  const src = videoSrcMatch?.[2] ? absolutify(videoSrcMatch[2]) : '';
  return { src };
}

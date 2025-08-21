export const extractVideoBlock = (
  content: string
): { html: string; src: string | null } | null => {
  if (!content) return null;

  // 1) Försök fånga hela Gutenberg-figuren
  const figureMatch = content.match(
    /<figure[^>]*class="[^"]*\bwp-block-video\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i
  );

  // 2) Fallback: fristående <video>…</video>
  const videoMatch = figureMatch
    ? null
    : content.match(/<video\b[\s\S]*?<\/video>/i);

  const blockHtml = figureMatch?.[0] ?? videoMatch?.[0] ?? null;
  if (!blockHtml) return null;

  // Hämta src från <video src="…"> i första hand
  const videoSrcMatch =
    blockHtml.match(/<video[^>]*\bsrc="([^"]+)"/i) ||
    blockHtml.match(/<source[^>]*\bsrc="([^"]+)"/i);

  const src = videoSrcMatch ? videoSrcMatch[1] : null;

  return { html: blockHtml, src };
};

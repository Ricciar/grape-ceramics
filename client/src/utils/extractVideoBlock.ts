/**
 * Extraherar videoblock från WordPress-innehåll
 * @param content - HTML-innehåll som kan innehålla videoblock
 * @returns HTML-sträng med video-taggen eller null om ingen video hittades
 */
export const extractVideoBlock = (content: string): string | null => {
  // Hitta videoblocket i innehållet
  const videoRegex = /<figure class="wp-block-video.*?>([\s\S]*?)<\/figure>/i;
  const match = content.match(videoRegex);

  if (match && match[1]) {
    // Extrahera video-taggen
    const videoTag = match[1].match(/<video.*?>[\s\S]*?<\/video>/i);
    if (videoTag) {
      return videoTag[0];
    }
  }

  // Försök med alternativ struktur (ibland saknas figure-wrapper)
  const directVideoRegex = /<video.*?>[\s\S]*?<\/video>/i;
  const directMatch = content.match(directVideoRegex);

  if (directMatch) {
    return directMatch[0];
  }

  return null;
};

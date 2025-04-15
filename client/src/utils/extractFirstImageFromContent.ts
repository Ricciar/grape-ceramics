import { WPPost } from '../pages/MainPage/types';

/**
 * Extraherar den första bilden från HTML-innehåll och returnerar dess URL och alt-text
 * @param content - HTML-innehåll att söka igenom
 * @returns Ett objekt med bildURL och alt-text, eller null om ingen bild hittades
 */
export interface ImageData {
  url: string;
  altText?: string;
}

export const extractFirstImageFromContent = (
  content: string
): ImageData | null => {
  // Regex för att hitta img-taggar och fånga både src och alt attribut
  const imgRegex =
    /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)?["'])?[^>]*>/i;
  const match = content.match(imgRegex);

  if (match) {
    // match[1] innehåller src-attributet (URL)
    const url = match[1];
    // match[2] innehåller alt-attributet (kan vara undefined)
    const altText = match[2] || '';

    return { url, altText };
  }

  // En alternativ regex som kollar om alt kommer före src
  const altFirstRegex =
    /<img[^>]+alt=["']([^"']*)?["'][^>]*src=["']([^"']+)["'][^>]*>/i;
  const altFirstMatch = content.match(altFirstRegex);

  if (altFirstMatch) {
    // I denna regex är grupperna omvända
    const url = altFirstMatch[2];
    const altText = altFirstMatch[1] || '';

    return { url, altText };
  }

  return null;
};

/**
 * Hämtar bild-URL och alt-text från WordPress-post
 * Försöker först med featured image, sedan med bilder i innehållet
 * @param post - WordPress-post
 * @returns Bild-data objekt med URL och alt-text, eller null
 */
export const getImageUrlFromPost = (post: WPPost): ImageData | null => {
  // Option 1: Försök med WordPress featured image
  if (
    post._embedded &&
    post._embedded['wp:featuredmedia'] &&
    post._embedded['wp:featuredmedia'][0]
  ) {
    const media = post._embedded['wp:featuredmedia'][0];

    // Kolla efter source_url
    if (media.source_url) {
      // Försök hitta alt-text från olika möjliga källor
      const altText =
        media.alt_text || (media.title && media.title.rendered) || '';

      return {
        url: media.source_url,
        altText,
      };
    }

    // Kolla efter nested media_details
    if (media.media_details?.sizes?.full?.source_url) {
      const altText =
        media.alt_text || (media.title && media.title.rendered) || '';

      return {
        url: media.media_details.sizes.full.source_url,
        altText,
      };
    }
  }

  // Option 2: Extrahera från innehåll
  if (post.content && post.content.rendered) {
    const imageData = extractFirstImageFromContent(post.content.rendered);
    if (imageData) {
      return imageData;
    }
  }

  return null;
};

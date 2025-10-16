import { NextFunction, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { CustomError } from '../middleware/customError.js';
import { decodeHtmlEntities } from '../utils/decodeHtml.js';

/**
 * Hämtar WordPress-sidor via slug och ser till att:
 *  - Bas-URL tas från env om den finns (fallback till https://www.grapeceramics.se)
 *  - Innehållet avkodas (&#8211; -> – osv) innan det skickas till frontend
 */
export class WordPressPageController {
  private baseUrl: string;

  constructor() {
    // Försök läsa från env, annars använd www-adressen (den som faktiskt svarar)
    const fromEnv =
      process.env.WORDPRESS_API_URL || process.env.WP_BASE_URL || '';

    // Om env pekar på basdomänen, bygg REST-vägen; om den redan är /wp-json/.. låt den vara.
    // Exempel:
    //  - WP_BASE_URL = https://www.grapeceramics.se
    //  - WORDPRESS_API_URL = https://www.grapeceramics.se/wp-json/wp/v2
    const normalized = fromEnv.replace(/\/+$/, '');
    this.baseUrl = normalized.includes('/wp-json/')
      ? normalized
      : `${normalized || 'https://www.grapeceramics.se'}/wp-json/wp/v2`;
  }

  public async getPage(req: Request, res: Response, next: NextFunction) {
    const slug = String(req.query.slug || '').trim();
    if (!slug) {
      return res.status(400).json({ error: 'Missing required parameter "slug"' });
    }

    try {
      // Ex: GET https://www.grapeceramics.se/wp-json/wp/v2/pages?slug=kontakt
      const url = `${this.baseUrl}/pages`;
      const response = await axios.get(url, {
        params: { slug },
        // vissa hostar är kinkiga – ofarligt att sätta dessa
        headers: {
          Accept: 'application/json',
          'User-Agent': 'GrapeCeramics-Netlify-Proxy',
        },
        // följ redirects om hosten svarar 301/302
        maxRedirects: 5,
        timeout: 15000,
      });

      const arr = Array.isArray(response.data) ? response.data : [];

      // Avkoda innehållet på varje sida
      const cleaned = arr.map((p: any) => {
        const rendered = p?.content?.rendered ?? '';
        return {
          ...p,
          content: {
            ...p.content,
            rendered: decodeHtmlEntities(rendered),
          },
          title: {
            ...p.title,
            rendered: decodeHtmlEntities(p?.title?.rendered ?? ''),
          },
          excerpt: p?.excerpt
            ? {
                ...p.excerpt,
                rendered: decodeHtmlEntities(p.excerpt.rendered ?? ''),
              }
            : p?.excerpt,
        };
      });

      return res.json(cleaned);
    } catch (err) {
      const ax = err as AxiosError;
      // Logga lite extra så vi ser vad som händer under dev
      console.error(
        'WP page fetch error:',
        ax.response?.status,
        ax.response?.statusText,
        ax.response?.data || ax.message
      );

      return next(new CustomError('Error fetching WordPress data', 502));
    }
  }
}

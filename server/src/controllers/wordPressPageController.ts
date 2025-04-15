import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { CustomError } from '../middleware/customError.js';

export class WordPressPageController {
  // Metod för att hämta en WordPress-sida baserat på slug, ex: /api/pages?slug=startsida
  async getPage(req: Request, res: Response, next: NextFunction) {
    const { slug } = req.query;
    if (!slug) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter "slug"' });
    }

    try {
      const response = await axios.get(
        'https://grapeceramics.se/wp-json/wp/v2/pages',
        {
          params: { slug },
        }
      );
      // Om du vill kan du även mappa om datan här med en mapper-funktion
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching WordPress page:', error);
      // Exempel på att kasta en custom error
      return next(new CustomError('Error fetching WordPress data', 500));
    }
  }
}

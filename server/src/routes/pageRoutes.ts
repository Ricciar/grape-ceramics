import { Router, Request, Response, NextFunction } from 'express';
import { WordPressPageController } from '../controllers/wordPressPageController.js';

const router = Router();
const wpPageController = new WordPressPageController();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  wpPageController.getPage(req, res, next);
});

export default router;

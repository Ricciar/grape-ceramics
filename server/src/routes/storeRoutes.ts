import { Router, Request, Response, NextFunction } from 'express';
import { StoreController } from '../controllers/storeController.js';
import { ApiClient } from '../services/apiClient.js';
import { ProductMapper } from '../services/productMapper.js';
import { CategoryMapper } from '../services/categoryMapper.js';
import { OrderService } from '../services/orderService.js';
import { config } from '../config/environment.js';
import { Config } from '../config/types/config.js';

const router = Router();
console.log('✅ storeRoutes.ts laddas in');

const serviceConfig: Config = {
  apiUrl: config.woocommerceApiUrl,
  woocommerceConsumerKey: config.woocommerceConsumerKey,
  woocommerceConsumerSecret: config.woocommerceConsumerSecret,
};

const apiClient = new ApiClient(serviceConfig);
const productMapper = new ProductMapper();
const categoryMapper = new CategoryMapper();
const orderService = new OrderService(serviceConfig);

const storeController = new StoreController(
  apiClient,
  productMapper,
  categoryMapper,
  orderService
);

// alla metoder returnerar Promise<void> nu
router.get(
  '/products/:id',
  (req: Request, res: Response, next: NextFunction) =>
    void storeController.getProductById(req, res, next)
);

router.get(
  '/products',
  (req: Request, res: Response, next: NextFunction) =>
    void storeController.getAllProducts(req, res, next)
);

router.get(
  '/courses',
  (req: Request, res: Response, next: NextFunction) =>
    void storeController.getAllCourses(req, res, next)
);

router.get(
  '/category',
  (req: Request, res: Response, next: NextFunction) =>
    void storeController.getProductCategory(req, res, next)
);

router.post(
  '/order',
  (req: Request, res: Response, next: NextFunction) =>
    void storeController.createOrder(req, res, next)
);

export default router;

import { Router } from 'express';
import { StoreController } from '@/controllers/storeController';
import { ApiClient } from '@/services/apiClient';
import { ProductMapper } from '@/services/productMapper';
import { CategoryMapper } from '@/services/categoryMapper';
import { OrderService } from '@/services/orderService';
import { config } from '@/config/environment';
import { Config } from '@/config/types/config';

const router = Router();

// Mappa environment config till Config interface
const serviceConfig: Config = {
  apiUrl: config.woocommerceApiUrl,
  woocommerceConsumerKey: config.woocommerceConsumerKey,
  woocommerceConsumerSecret: config.woocommerceConsumerSecret,
};

const apiClient = new ApiClient();
const productMapper = new ProductMapper();
const categoryMapper = new CategoryMapper();
const orderService = new OrderService(serviceConfig);

export const storeController = new StoreController(
  apiClient,
  productMapper,
  categoryMapper,
  orderService
);

router.get(
  '/products/:id',
  storeController.getProductById.bind(storeController)
);
router.get('/products', storeController.getAllProducts.bind(storeController));
router.get(
  '/category',
  storeController.getProductCategory.bind(storeController)
);
router.post('/order', storeController.createOrder.bind(storeController));

export default router;

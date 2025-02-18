import { Router } from 'express';
import { StoreController } from '@/controllers/storeController.js';
import { ApiClient } from '@/services/apiClient.js';
import { ProductMapper } from '@/services/productMapper.js';
import { CategoryMapper } from '@/services/categoryMapper.js';
import { OrderService } from '@/services/orderService.js';
import { config } from '@/config/environment.js';
import { Config } from '@/config/types/config';

const router = Router();

// Mappa environment config till Config interface
const serviceConfig: Config = {
  apiUrl: config.woocommerceApiUrl,
  woocommerceConsumerKey: config.woocommerceConsumerKey,
  woocommerceConsumerSecret: config.woocommerceConsumerSecret,
};

const apiClient = new ApiClient(serviceConfig);
const productMapper = new ProductMapper();
const categoryMapper = new CategoryMapper();
const orderService = new OrderService(serviceConfig);

// En instans av StoreController skapas med hjälp av de instanser som skapats ovan
const storeController = new StoreController(
  apiClient,
  productMapper,
  categoryMapper,
  orderService
);

// Här definieras de olika endpoints som StoreController ska hantera
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

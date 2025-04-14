import {
  Product,
  ProductResponse,
  FeaturedProduct,
} from '../controllers/types/product.types.js';
import { stripHtml } from '../utils/productUtils.js';

// Tar in rådata från API
export class ProductMapper {
  mapProduct(product: ProductResponse): Product {
    return {
      id: product.id,
      name: product.name,
      images: product.images.map((image) => image.src),
      description: stripHtml(product.description),
      short_description: stripHtml(product.short_description),
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      price: product.price,
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity,
      categories: product.categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
      tags: product.tags || [],
    };
  }
}

import {
  CategoryResponse,
  Category,
} from '../controllers/types/category.types.js';
import { stripHtml } from '../utils/productUtils.js';

export class CategoryMapper {
  mapCategory(category: CategoryResponse): Category {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      images: [],
      description: stripHtml(category.description),
      display: category.display,
      image: {
        id: category.image?.id ?? 0,
        src: category.image?.src ?? '',
        name: category.image?.name ?? '',
        alt: category.image?.alt ?? '',
      },
    };
  }
}

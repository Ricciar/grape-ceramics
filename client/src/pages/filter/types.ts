import { Product } from '../shopgrid/types';

export interface FilterMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
  products?: Product[];
  onFilterProducts?: (filteredProducts: Product[]) => void;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface CategoryListProps {
  categories: Category[];
  selectedCategoriesIds: number[];
  onCategoryClick: (category: string) => void;
  productCountByCategory?: Record<number, number>;
}

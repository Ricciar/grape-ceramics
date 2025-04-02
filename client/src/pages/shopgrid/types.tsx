import { Category } from '../filter/types';

export interface Product {
  id: number;
  name: string;
  images: string[];
  regular_price: string;
  sale_price: string | null;
  price: string;
  categories: Category[];
}

export interface ProductCardProps {
  product: Product;
  index: number;
  onClick: (id: number) => void;
}

export interface DesktopProductCardProps {
  product: Product;
  onClick: (id: number) => void;
}

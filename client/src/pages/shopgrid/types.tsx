import { Category } from '../filter/types';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface Product {
  id: number;
  name: string;
  images: ProductImages[];
  regular_price: string;
  sale_price: string | null;
  price: string;
  categories: Category[];
  tags: Tag[];
  short_description: string;
}

export interface ProductImages {
  id: number;
  name: string;
  alt: string;
  src: string;
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

export interface FeaturedProducts {
  one: Product | null;
  two: Product | null;
  three: Product | null;
  four: Product | null;
  five: Product | null;
  six: Product | null;
}

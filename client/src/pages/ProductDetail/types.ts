// Typ för produktdata som hämtas från API:et
export interface ProductImage {
  src: string;
  alt?: string;
}

export interface Product {
  id: number;
  name: string;
  images: { src: string; alt?: string }[];
  description: string;

  // 👇 nytt fält som följer Store API:s struktur
  prices: {
    price: number;
    regular_price: number;
    sale_price: number | null;
    currency_code: string;
  };

  stock_quantity: string | null;
  stock_status: string;
  short_description?: string;
  tags?: { id: number; name: string; slug: string }[];
}

export interface ProductDetailProps {
  onLoadingChange?: (loading: boolean) => void;
}

// Props för bildgalleriet
export interface ImageGalleryProps {
  images: string[];
  currentIndex: number;
  onImageClick: (index: number) => void;
}

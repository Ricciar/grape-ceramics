// Typ för produktdata som hämtas från API:et
export interface Product {
  id: number;
  name: string;
  images: string[]; // Array av bild-URL:er
  description: string;
  regular_price: string | null;
  sale_price: string | null;
  price: string;
  stock_quantity: string;
  stock_status: string;
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

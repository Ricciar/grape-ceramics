/**
 * Representerar svarsformatet från WooCommerce API för produktdata.
 * Detta interface används för att typifiera den rådata vi får från API:et
 * innan den transformeras till vår interna produktmodell.
 */
export interface ProductResponse {
  id: number;
  name: string;
  images: ProductImages[];
  description: string;
  short_description: string;
  regular_price: string;
  sale_price: string;
  price: string;
  stock_status: string;
  stock_quantity: number | null;
  categories: {
    id: number;
    name: string;
    slug?: string; // WooCommerce kan returnera slug
  }[];
  tags: ProductTag[];
}

export interface ProductImages {
  id: number;
  name: string;
  alt: string;
  src: string;
}

/**
 * Intern produktmodell för applikationen
 * Detta är vår standardiserade produktstruktur som används genom applikationen
 * efter att data har transformerats från API-svaret.
 */
export interface Product {
  id: number;
  name: string;
  images: ProductImages[];
  description: string;
  short_description: string;
  regular_price: string;
  sale_price: string;
  price: string;
  stock_status: string;
  stock_quantity: number | null;
  categories: {
    id: number;
    name: string;
    slug?: string;
  }[];
  tags: ProductTag[];
}

/**
 * Enkel struktur för WooCommerce-taggar på produkter
 */
export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

/**
 * FeaturedProduct är något helt separat (ex. när du listar
 * populära taggar eller kategorier med extra data).
 */
export interface FeaturedProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

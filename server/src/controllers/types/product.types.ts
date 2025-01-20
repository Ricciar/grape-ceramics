export interface Product {
   id: number;
   name: string;
   images: string[];
   regular_price: string;
   sale_price: string;
   price: string;
   stock_status: string;
   stock_quantity?: number;
}

export interface ProductResponse {
   id: number;
   name: string;
   images: Array<{ src: string }>;
   description: string;
   regular_price: string;
   sale_price: string;
   price: string;
   stock_status: string;
   stock_quantity?: number;
}

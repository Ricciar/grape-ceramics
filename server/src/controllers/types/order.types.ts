/**
 * WooCommerce API Types
 * Dessa typer representerar den datastruktur som WooCommerce API:et använder
 */

export interface WooCommerceOrderResponse {
  id: number;
  status: string;
  total: string;
  currency: string;
  date_created: string;
  billing: WooCommerceAddress;
  shipping: WooCommerceAddress;
  line_items: WooCommerceLineItem[];
  order_key: string;
}

/**
 * WooCommerce Address Format
 * Detta är det format som WooCommerce förväntar sig för adresser
 * Används för både fakturering (billing) och leverans (shipping)
 */
export interface WooCommerceAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

/**
 * WooCommerce Line Item Format
 * Representerar en produkt i en WooCommerce-order
 */
export interface WooCommerceLineItem {
  product_id: number;
  name: string;
  quantity: number;
  total: string;
}

/**
 * Frontend Types
 * Dessa typer används för kommunikation mellan frontend och vår backend
 */

/**
 * Data som skickas från frontend när en order skapas
 */
export interface CreateOrderRequest {
  cart: CartItem[];
  billing?: CustomerAddress; // Ändrat från Address till CustomerAddress
  shipping?: CustomerAddress; // Ändrat från Address till CustomerAddress
}

/**
 * Svaret som skickas tillbaka till frontend efter att en order skapats
 */
export interface CreateOrderResponse {
  orderId: number;
  checkoutUrl: string;
}

/**
 * Intern adressmodell för vår applikation
 * Detta är den struktur vi använder internt i vår applikation
 */
export interface CustomerAddress {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
}

/**
 * Representerar en produkt i kundvagnen
 * Minimal information som behövs från frontend
 */
export interface CartItem {
  id: number;
  quantity: number;
}

/**
 * Data som skickas till WooCommerce när en order skapas
 * Detta är det format som WooCommerce API:et förväntar sig
 */
export interface WooCommerceOrderRequest {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: WooCommerceAddress;
  shipping: WooCommerceAddress;
  line_items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

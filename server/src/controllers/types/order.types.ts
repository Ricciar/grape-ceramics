export interface CartItem {
   id: number;
   quantity: number;
}

export interface Address {
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

export interface OrderRequest {
   cart: CartItem[];
   billing?: Address;
   shipping?: Address;
}

export interface OrderData {
   payment_method: string;
   payment_method_title: string;
   set_paid: boolean;
   billing: Address;
   shipping: Address;
   line_items: Array<{
      product_id: number;
      quantity: number;
   }>;
}

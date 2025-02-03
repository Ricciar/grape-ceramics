import {
  CreateOrderRequest,
  CreateOrderResponse,
  WooCommerceOrderRequest,
  WooCommerceOrderResponse,
  WooCommerceAddress,
  CustomerAddress,
} from '@/controllers/types/order.types';

export class OrderMapper {
  /**
   * Konverterar en CreateOrderRequest från frontend till WooCommerceOrderRequest
   * @param orderRequest - Data som kommer från frontend
   * @returns Data formaterad för WooCommerce API
   */
  public mapToWooCommerceRequest(
    orderRequest: CreateOrderRequest
  ): WooCommerceOrderRequest {
    return {
      payment_method: 'woocommerce_payments',
      payment_method_title: 'Credit Card / Debit Card',
      set_paid: false, // WooCommerce hanterar betalning
      billing: this.mapToWooCommerceAddress(
        orderRequest.billing || this.getDefaultAddress()
      ),
      shipping: this.mapToWooCommerceAddress(
        orderRequest.shipping ||
          orderRequest.billing ||
          this.getDefaultAddress()
      ),
      line_items: orderRequest.cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
  }

  /**
   * Skapar CreateOrderResponse från WooCommerce-svaret
   * @param orderResponse - Svaret från WooCommerce API
   * @returns Data formaterad för frontend
   */
  mapFromOrderResponse(
    orderResponse: WooCommerceOrderResponse
  ): CreateOrderResponse {
    return {
      orderId: orderResponse.id,
      checkoutUrl: `${process.env.WOOCOMMERCE_STORE_URL}checkout/order-pay/${orderResponse.id}/?key=${orderResponse.order_key}`,
    };
  }

  /**
   * Konverterar vår interna adressformat till WooCommerce-format
   * @param address - Intern adressrepresentation
   * @returns Adress formaterad för WooCommerce
   */
  private mapToWooCommerceAddress(
    address: CustomerAddress
  ): WooCommerceAddress {
    return {
      first_name: address.firstName,
      last_name: address.lastName,
      address_1: address.streetAddress,
      city: address.city,
      state: address.state,
      postcode: address.postalCode,
      country: address.country,
      email: address.email,
      phone: address.phone,
    };
  }

  /**
   * Returnerar en standardadress i internt format
   * @returns Standard CustomerAddress
   */
  private getDefaultAddress(): CustomerAddress {
    return {
      firstName: 'Placeholder',
      lastName: 'Customer',
      streetAddress: '123 Main St',
      city: 'Stockholm',
      state: 'Stockholm',
      postalCode: '12345',
      country: 'SE',
      email: 'placeholder@example.com',
      phone: '0701234567',
    };
  }
}

import { ApiClient } from './apiClient';
import { OrderMapper } from './orderMapper';
import {
  CreateOrderRequest,
  WooCommerceOrderRequest,
  WooCommerceOrderResponse,
  CreateOrderResponse,
} from '@/controllers/types/order.types';
import { Config } from '@/config/types/config';
import { WooCommerceError } from '@/controllers/types/error.types';

export class OrderService {
  private readonly orderMapper: OrderMapper;
  private readonly apiClient: ApiClient;

  constructor(config: Config) {
    this.orderMapper = new OrderMapper();
    this.apiClient = new ApiClient(config);
  }

  /**
   * Skapar en ny order i WooCommerce och returnerar checkout-information
   *
   * @param orderRequest - Order-data från frontend
   * @returns Promise med checkout-information (orderId och URL)
   * @throws Error om varukorgen är tom
   * @throws WooCommerceError vid problem med API-anropet
   */
  async createOrder(
    orderRequest: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    // Validera varukorgen
    if (!orderRequest.cart || orderRequest.cart.length === 0) {
      throw new Error('Cart is empty or invalid.');
    }

    try {
      // Konvertera order till WooCommerce-format
      const orderData: WooCommerceOrderRequest =
        this.orderMapper.mapToWooCommerceRequest(orderRequest);

      // Skicka ordern till WooCommcerce
      const response = await this.apiClient.createOrder(orderData);
      const wooCommerceResponse = response.data as WooCommerceOrderResponse;

      // Konvertera svaret till frontend-format
      return this.orderMapper.mapFromOrderResponse(wooCommerceResponse);
    } catch (error) {
      this.handleOrderError(error);
      throw new Error('Failed to process order');
    }
  }

  /**
   * Validerar att varukorgen innehåller produkter
   */
  private isValidCart(cart: CreateOrderRequest['cart']): boolean {
    return Array.isArray(cart) && cart.length > 0;
  }

  /**
   * Hanterar olika typer av fel vid orderhantering
   */
  private handleOrderError(error: unknown): never {
    console.error('Error creating order:', error);

    if (this.isWooCommerceError(error)) {
      throw new Error(error.response.data.message || 'Woocommerce API Error');
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }

  /**
   * Type guard för WooCommerce API-fel
   */
  private isWooCommerceError(error: unknown): error is WooCommerceError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'data' in error.response
    );
  }
}

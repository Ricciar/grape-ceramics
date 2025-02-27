import { ApiClient } from '../services/apiClient.js';
import {
  WooCommerceOrderRequest,
  WooCommerceOrderResponse,
} from '../controllers/types/order.types.js';
import axios from 'axios';

// Mocka axios för att undvika riktiga API-anrop när vi testar
jest.mock('axios');
// Ger oss TS-stöd för mockfunktionerna
const mockedAxios = jest.mocked(axios);

// En container för relaterade tester inom ApiClient
describe('ApiClient', () => {
  let apiClient: ApiClient;

  // Test-konfiguration
  const testConfig = {
    apiUrl: 'https://test-api.com/',
    woocommerceConsumerKey: 'test-key',
    woocommerceConsumerSecret: 'test-secret',
  };

  // Förbered: Skapa test-data
  const mockProducts = [
    { id: 1, name: 'Test Product 1' },
    { id: 2, name: 'Test Product 2' },
  ];

  // Detta körs före varje enskilt test
  beforeEach(() => {
    // Skapa en ny instans av ApiClient med test-config
    apiClient = new ApiClient(testConfig);
    // Rensa alla mock-anrop mellan tester
    jest.clearAllMocks();
  });

  // Tester för getProducts metoden
  describe('getProducts', () => {
    // Test 1: Lyckad hämtning med produkter
    it('should fetch products successfully', async () => {
      // Talar om vad mock-versionen av axios ska returnera
      // mockResolvedValueOnce simulerar ett lyckat API-svar
      mockedAxios.get.mockResolvedValueOnce({ data: mockProducts });

      // Utför: Anropa metoden vi testar
      const result = await apiClient.getProducts();

      // Kontrollera: Varifiera att allt fungerade som förväntat
      // toHaveBeenCalledWith kontrollerar att mockfunktionen anropades med rätt argument
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test-api.com/products',
        {
          auth: {
            username: 'test-key',
            password: 'test-secret',
          },
          timeout: 10000,
        }
      );
      expect(result.data).toEqual(mockProducts);
    });

    // Test 2: Hanter API-fel
    it('should handle API errors', async () => {
      const errorMessage = 'API Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(apiClient.getProducts()).rejects.toThrow(errorMessage);
    });

    // Test 3: Hantera tom lista
    it('should handle empty product list', async () => {
      // mockResolvedValueOnce simulerar ett lyckat API-svar (med ata)
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      const result = await apiClient.getProducts();
      expect(result.data).toEqual([]);
    });
  });

  // Tester för getProductById
  describe('getProductById', () => {
    const mockProduct = { id: 1, name: 'Test Product 1' };

    // Test 1: Lyckad hämtning av produkt
    it('should successfully fetch a product based on its unique ID', async () => {
      // Mocka svaret för en specifik produkt
      mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

      // Utför: Anropa metoden vi testar med ett specifik ID
      const result = await apiClient.getProductById(1);

      // Kontrollera: Varifiera att allt fungerade som förväntat
      // toHaveBeenCalledWith kontrollerar att mockfunktionen anropades med rätt argument
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test-api.com/products/1',
        {
          auth: {
            username: 'test-key',
            password: 'test-secret',
          },
          timeout: 10000,
        }
      );
      expect(result.data).toEqual(mockProduct);
    });

    // Test 2: Hanter API-fel
    it('should handle API errors when fetching a specifik product', async () => {
      const errorMessage = 'API Error';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(apiClient.getProductById(1)).rejects.toThrow(errorMessage);
    });

    // Test 3: Hanterna när produkten inte hittas
    it('should handle product not found', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: null });

      const result = await apiClient.getProductById(999);
      expect(result.data).toBeNull();
    });
  });

  // Tester för getProductCategories
  describe('getProductCategories', () => {
    const mockCategories = [
      { id: 1, name: 'Test Category 1' },
      { id: 2, name: 'Test Category 2' },
    ];

    // Test 1: Lyckad hämtning av produktkategorier
    it('should successfully fetch product categories', async () => {
      // Mocka svaret för kategorier
      mockedAxios.get.mockResolvedValueOnce({ data: mockCategories });

      // Utför: Anropa metoden vi testar
      const result = await apiClient.getProductCategories();

      // Kontrollera: Varifiera att allt fungerade som förväntat
      // toHaveBeenCalledWith kontrollerar att mockfunktionen anropades med rätt argument
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://test-api.com/products/categories',
        {
          auth: {
            username: 'test-key',
            password: 'test-secret',
          },
          timeout: 10000,
        }
      );
      expect(result.data).toEqual(mockCategories);
    });
  });

  // Test 2: Hantera API-fel
  it('should handle API errors when fetching categories', async () => {
    const errorMessage = 'API Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(apiClient.getProductCategories()).rejects.toThrow(
      errorMessage
    );
  });

  // Test 3: hantera tom lista av kategorier
  it('should handle empty category list', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const result = await apiClient.getProductCategories();
    expect(result.data).toEqual([]);
  });

  // Tester för createOrder
  describe('createOrder', () => {
    // mock-data som matchar interface-definitioner
    const mockWooCommerceOrderRequest: WooCommerceOrderRequest = {
      payment_method: 'bacs',
      payment_method_title: 'Direktbetalning',
      set_paid: false,
      billing: {
        first_name: 'John',
        last_name: 'Doe',
        address_1: 'Testgatan 1',
        city: 'Stockholm',
        state: 'Stockholm',
        postcode: '12345',
        country: 'SE',
        email: 'john.doe@example.com',
        phone: '0701234567',
      },
      shipping: {
        first_name: 'John',
        last_name: 'Doe',
        address_1: 'Testgatan 1',
        city: 'Stockholm',
        state: 'Stockholm',
        postcode: '12345',
        country: 'SE',
        email: 'john.doe@example.com',
        phone: '0701234567',
      },
      line_items: [
        {
          product_id: 1,
          quantity: 2,
        },
      ],
    };

    const mockWooCommerceOrderResponse: WooCommerceOrderResponse = {
      id: 1,
      status: 'pending',
      total: '299.00',
      currency: 'SEK',
      date_created: '2025-02-06T12:00:00',
      order_key: 'wc_order_123abc',
      billing: mockWooCommerceOrderRequest.billing,
      shipping: mockWooCommerceOrderRequest.shipping,
      line_items: [
        {
          product_id: 1,
          name: 'Test Produkt',
          quantity: 2,
          total: '299.00',
        },
      ],
    };

    // Test 1: Lyckad skapande av en order
    it('should successfully create an order', async () => {
      // Mocka svaret för order
      mockedAxios.post.mockResolvedValueOnce({
        data: mockWooCommerceOrderResponse,
      });

      // Utför: Anropa metoden vi testar
      const result = await apiClient.createOrder(mockWooCommerceOrderRequest);

      // Kontrollera: Varifiera att allt fungerade som förväntat
      // toHaveBeenCalledWith kontrollerar att mockfunktionen anropades med rätt argument
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://test-api.com/orders',
        mockWooCommerceOrderRequest,
        {
          auth: {
            username: 'test-key',
            password: 'test-secret',
          },
          timeout: 10000,
        }
      );
      expect(result.data).toEqual(mockWooCommerceOrderResponse);
    });
  });
});

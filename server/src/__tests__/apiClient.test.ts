import { ApiClient } from '@/services/apiClient';
import axios from 'axios';

// Mocka axios för att undvika riktiga API-anrop när vi testar
jest.mock('axios');
// Ger oss TS-stöd för mockfunktionerna
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
});

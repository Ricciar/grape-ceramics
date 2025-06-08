import { ApiClient } from './services/apiClient.js';

const apiClient = new ApiClient();

/**
 * preloadAllWooData
 * -----------------
 * Hämtar och cachar kritisk data från WooCommerce och CMS.
 * Körs vid serverstart och kan även schemaläggas för att förnya cachen.
 */
export async function preloadAllWooData() {
  console.log('[PRELOAD] Starting preload of WooCommerce data...');
  const tasks: Promise<void>[] = [];

  // Förstartsida: produkter (första sidan)
  tasks.push(preloadCache('products', () => apiClient.getProducts(1, 12)));

  // Populära kategorier
  tasks.push(
    preloadCache('categories', () => apiClient.getProductCategories())
  );

  // Enskild produkt (ex. kampanj)
  // tasks.push(preloadCache('product-123', () => apiClient.getProductById(123)));

  // CMS-sidor som används ofta
  tasks.push(preloadCache('page-sidfot', () => fetchPageFromCMS('sidfot')));
  tasks.push(
    preloadCache('page-startsida', () => fetchPageFromCMS('startsida'))
  );

  await Promise.all(tasks);
  console.log('[PRELOAD] All WooCommerce data preloaded.');
}

/**
 * preloadCache
 * ------------
 * Generisk funktion som hämtar och cachar data med nyckel.
 */
async function preloadCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>
): Promise<void> {
  try {
    const result = await fetchFn();
    apiClient.setCache(cacheKey, result);
    console.log(`[PRELOADED] ${cacheKey}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[PRELOAD ERROR] ${cacheKey}:`, error.message);
    } else {
      console.error(`[PRELOAD ERROR] ${cacheKey}:`, error);
    }
  }
}

/**
 * fetchPageFromCMS
 * ----------------
 * Hämtar en CMS-sida via Netlify Function (eller annan API).
 */
async function fetchPageFromCMS(slug: string): Promise<any> {
  const response = await fetch(
    `http://localhost:8888/.netlify/functions/api?slug=${slug}`
  );
  if (!response.ok) throw new Error(`Failed to fetch page: ${slug}`);
  return response.json();
}

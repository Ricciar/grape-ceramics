const isProduction = import.meta.env.PROD;

// Bas-URL för API-anrop
export const API_BASE_URL = isProduction
  ? '/.netlify/functions/api' // Netlify Functions i produktion
  : '/api'; // Proxy i utvecklingsmiljö

// Funktion för att bygga fullständiga API-URL:er
export const apiUrl = (endpoint: string) => {
  // Ta bort eventuellt inledande /api från endpoint
  const cleanEndpoint = endpoint.replace(/^\/api\//, '');
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

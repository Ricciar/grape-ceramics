// client/src/config/api.ts

const API_BASE_URL = import.meta.env.PROD
  ? "https://grapeceramics.netlify.app"
  : "http://localhost:8888";

export default API_BASE_URL;


/**
 * Bygger fullständig URL till API:t.
 */
export const apiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.replace(/^\/api\//, "");
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

import dotenv from 'dotenv';
import { EnvironmentConfig } from './types/environment.types.js';
// Läs in .env-filen
dotenv.config();
console.log('Loaded environment variables:', {
  PORT: process.env.PORT,
  WOOCOMMERCE_API_URL: process.env.WOOCOMMERCE_API_URL,
  WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  WOOCOMMERCE_STORE_URL: process.env.WOOCOMMERCE_STORE_URL,
  WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
  WORDPRESS_APP_PASSWORD: process.env.WORDPRESS_APP_PASSWORD,
  CORS_ORIGINS: process.env.CORS_ORIGINS
});
/**
 * validateEnvironment
 * -------------------
 * Funktion som kontrollerar att alla nödvändiga miljövariabler (env vars)
 * finns definierade. Om någon saknas kastas ett fel.
 * Returnerar ett konfigurationsobjekt (EnvironmentConfig) med bekräftade
 * miljövariabler.
 */
function validateEnvironment(): EnvironmentConfig {
  // Lista över obligatoriska miljövariabler som måste finnas i .env
  const requiredEnvVars = [
    'PORT',
    'WOOCOMMERCE_API_URL',
    'WOOCOMMERCE_CONSUMER_KEY',
    'WOOCOMMERCE_CONSUMER_SECRET',
    'WOOCOMMERCE_STORE_URL',
  ] as const;

  // filter för att hitta saknade variabler
  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  // Om en eller flera miljövariabler  saknas, kasta ett beskrivande fel
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }

  /**
   * Hämtar upp de obligatoriska variablerna från process.env
   */
  const PORT = process.env.PORT;
  const apiUrl = process.env.WOOCOMMERCE_API_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
  const storeUrl = process.env.WOOCOMMERCE_STORE_URL;

  if (!PORT || !apiUrl || !consumerKey || !consumerSecret || !storeUrl) {
    throw new Error('Required environment variables are missing');
  }

  // När vi kollat att alla variabler finns, returnera config-objektet
  return {
    port: parseInt(PORT), // Konverterar till ett numeriskt värde
    woocommerceApiUrl: apiUrl,
    woocommerceConsumerKey: consumerKey,
    woocommerceConsumerSecret: consumerSecret,
    woocommerceStoreUrl: storeUrl,
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
  };
}

// Exportera config så att andra moduler kan använda den
export const config = validateEnvironment();

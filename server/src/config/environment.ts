import dotenv from "dotenv";
import { EnvironmentConfig } from "./types/environment.types";
// Läs in .env-filen
dotenv.config();

// Validera att alla nödvändiga värden finns, med en array of required vars
function validateEnvironment(): EnvironmentConfig {
   const requiredEnvVars = [
      "PORT",
      "WOOCOMMERCE_API_URL",
      "WOOCOMMERCE_CONSUMER_KEY",
      "WOOCOMMERCE_CONSUMER_SECRET",
      "WOOCOMMERCE_STORE_URL",
   ] as const;

   // filter för att hitta saknade variabler
   const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
   );

   // Om några variabler saknas, kasta ett beskrivande fel
   if (missingEnvVars.length > 0) {
      throw new Error(
         `Missing required environment variables: ${missingEnvVars.join(", ")}`
      );
   }

   // Validerar att alla värden finns
   const PORT = process.env.PORT;
   const apiUrl = process.env.WOOCOMMERCE_API_URL;
   const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
   const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
   const storeUrl = process.env.WOOCOMMERCE_STORE_URL;

   if (!PORT || !apiUrl || !consumerKey || !consumerSecret || !storeUrl) {
      throw new Error("Required environment variables are missing");
   }

   // När vi kollat att alla variabler finns, returnera config-objektet
   return {
      port: parseInt(PORT), // Konvertera PORT till nummer
      woocommerceApiUrl: apiUrl,
      woocommerceConsumerKey: consumerKey,
      woocommerceConsumerSecret: consumerSecret,
      woocommerceStoreUrl: storeUrl,
      environment:
         process.env.NODE_ENV === "production" ? "production" : "development",
   };
}

// Exportera config så att andra moduler kan använda den
export const config = validateEnvironment();

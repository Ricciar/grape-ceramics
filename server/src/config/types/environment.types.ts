export interface EnvironmentConfig {
   port: number;
   woocommerceApiUrl: string;
   woocommerceConsumerKey: string;
   woocommerceConsumerSecret: string;
   woocommerceStoreUrl: string;
   environment: "development" | "production";
}

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"), // Skapar ett alias "@" som pekar på "client/src"
      },
   },
   build: {
      outDir: "../dist", // Lägger dist-mappen i projektets rotkatalog
   },
   server: {
      port: 3000, // Specificerar porten för dev-servern om du vill köra den på något annat än 5173
   },
});

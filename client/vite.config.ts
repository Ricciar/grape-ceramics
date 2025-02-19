import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Skapar ett alias "@" som pekar på "client/src"
    },
  },
  build: {
    outDir: '../dist', // Lägger dist-mappen i projektets rotkatalog
  },
  server: {
    port: 5173, // Frontend-serverns port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend-serverns URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});

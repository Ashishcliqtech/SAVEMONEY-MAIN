import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'styled-components'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
          utils: ['axios', 'date-fns', 'clsx', 'jwt-decode', 'i18next', 'react-i18next'],
          query: ['@tanstack/react-query', 'react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://updatedbackendcashkro.onrender.com', // Replace with your Render URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: {
      overlay: false,
    },
  },
});

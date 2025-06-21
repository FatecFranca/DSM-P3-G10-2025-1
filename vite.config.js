import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      // Tentar corrigir conexão WebSocket
      timeout: 5000,
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
});

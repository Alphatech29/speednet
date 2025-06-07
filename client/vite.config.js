import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ defineConfig is now correctly defined
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // ✅ just 'dist'
    emptyOutDir: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {},
    },
    brotliSize: false,
  },
});

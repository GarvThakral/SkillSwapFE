import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create separate chunks for major dependencies
          if (id.includes('node_modules')) {
            if (id.includes('@dytesdk/react-web-core')) {
              return 'dyte-core';
            }
            if (id.includes('@dytesdk/react-ui-kit') || id.includes('@dytesdk/ui-kit')) {
              return 'dyte-ui';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            return 'vendor'; // Other dependencies
          }
        }
      }
    },
    chunkSizeWarningLimit: 1600,
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps for production to reduce file size
  },
  optimizeDeps: {
    include: [
      '@dytesdk/react-web-core',
      '@dytesdk/react-ui-kit'
    ]
  }
});
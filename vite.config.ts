import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 800, // Set the chunk size warning limit in KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split '@dytesdk' related packages into a separate chunk
          if (id.includes('node_modules')) {
            if (id.includes('@dytesdk')) return 'dytesdk';
            if (id.includes('@jitsi')) return 'jitsi-sdk';
            if (id.includes('react')) return 'react-vendor';
            return 'vendor'; // Other node_modules dependencies go to 'vendor'
          }
        },
      },
    },
  },
});

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Dyte packages
          if (id.includes('@dytesdk/react-ui-kit')) {
            return 'dyte-ui-kit';
          }
          if (id.includes('@dytesdk/web-core')) {
            return 'dyte-web-core';
          }
          if (id.includes('@dytesdk/react-web-core')) {
            return 'dyte-react-core';
          }
          
          // Split major third-party dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('styled-components')) {
              return 'vendor-styled';
            }
            if (id.includes('recoil')) {
              return 'vendor-recoil';
            }
            if (id.includes('@jitsi')) {
              return 'vendor-jitsi';
            }
            if (id.includes('peerjs') || id.includes('ws')) {
              return 'vendor-networking';
            }
            // All remaining node_modules
            return 'vendor-other';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
    minify: 'esbuild',
    target: 'esnext'
  },
  optimizeDeps: {
    include: [
      '@dytesdk/react-ui-kit',
      '@dytesdk/react-web-core',
      '@dytesdk/web-core',
      'styled-components',
      'recoil'
    ]
  }
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tagger from '@dhiwise/component-tagger';

// TypeScript Vite config equivalent to previous vite.config.mjs
// Note: outDir is set to 'dist' to match the Dockerfile COPY step
export default defineConfig({
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: 4028,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['*'],
  },
});

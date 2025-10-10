import { defineConfig } from 'vite';
import path from 'path';

// Minimal Vite config (CJS-friendly) to avoid ESM-only plugin issues
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  server: {
    host: '::',
    port: 8080,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    global: 'globalThis',
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});

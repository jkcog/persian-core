import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.js' },
    format: ['esm'],
    outDir: 'dist',
    clean: true,
    dts: false,
  },
  {
    entry: { 'persian-core': 'src/index.js' },
    format: ['iife'],
    globalName: 'PersianCore',
    outDir: 'dist',
    clean: false,
  },
]);

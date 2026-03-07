import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@git-diff-view/core'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.json' })],
});

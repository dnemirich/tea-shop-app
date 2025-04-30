import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      minify: mode === 'production' ? 'esbuild' : false,
      sourcemap: mode !== 'production',
    },
    server: {
      open: mode === 'development',
    },
  };
});

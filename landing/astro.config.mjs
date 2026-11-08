import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://64-177-42-81.sslip.io',
  output: 'static',
  server: { host: '127.0.0.1', port: 4321 },
  vite: {
    server: {
      fs: { allow: [fileURLToPath(new URL('../', import.meta.url))] },
      proxy: { '^/app(?:/|$)': { target: 'http://127.0.0.1:3999' } },
    },
  },
});

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: true,
    allowedHosts: [
      '8a95bc6fb80f.ngrok-free.app', // ❌ remove the extra space!
    ],
  },
});

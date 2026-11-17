import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },

  // the reload was getting triggered because when we update the file using `nodejs fs`, it releases multiple events stating `the file is changed`, so the vite development server which is watching for the file changes detects these events and triggers the reload
  watch: {
    usePolling: true,
    interval: 300,
    ignored: ['node_modules'],
  },
});

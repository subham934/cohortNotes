import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true, // the vite-deployment-server that on user-pod, runs on localhost:5173, the request that comes to this pod is from pod1.preview.localhost, so the request pod1.preview.localhost is different from localhost:5173, so we need to allow the request from pod1.preview.localhost, so we set allowedHosts: true, so that the request from pod1.preview.localhost is allowed.

  }
})

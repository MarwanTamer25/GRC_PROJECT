import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/GRC_PROJECT/',
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Ollama API requests to avoid CORS issues
      '/api/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying to Ollama:', req.method, req.url);
          });
        }
      }
    }
  }
})

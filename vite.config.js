import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ESTA ES LA CONFIGURACIÓN QUE SOLUCIONA TODO
    proxy: {
      // Cualquier petición que empiece con '/api' o '/sanctum'
      // será redirigida a nuestro backend de Laravel.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/sanctum': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
      }
    }
  }
})
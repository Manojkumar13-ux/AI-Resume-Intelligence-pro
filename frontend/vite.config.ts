import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Only use proxy in development
    proxy: process.env.NODE_ENV === 'development' ? {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    } : {},
  },
})
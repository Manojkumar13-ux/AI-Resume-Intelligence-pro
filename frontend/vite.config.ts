import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
<<<<<<< HEAD
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://ai-resume-intelligence-pro-1.onrender.com'),
=======
>>>>>>> e623c2a1d3ea81c8a73e9f605f73e07ef24064a2
  },
})

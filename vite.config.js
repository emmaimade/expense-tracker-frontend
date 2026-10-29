import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // Mirror the production setup (vercel.json): the app calls /api/* on its
      // own origin and the request is forwarded to the API. Point
      // VITE_DEV_API_TARGET at a local API (e.g. http://localhost:5000) if needed.
      proxy: {
        '/api': {
          target: env.VITE_DEV_API_TARGET || 'https://expense-tracker-api-hvss.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

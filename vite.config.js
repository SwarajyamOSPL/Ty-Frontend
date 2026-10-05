import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': '/src' } },
    server: {
      // dev proxy avoids CORS issues when calling the backend
      proxy: { '/api': { target: env.VITE_PROXY_TARGET, changeOrigin: true } },
    },
  }
})

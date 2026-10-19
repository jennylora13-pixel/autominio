import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    // em desenvolvimento, /api vai para o servidor de oração (npm run server)
    proxy: { '/api': 'http://localhost:8787' },
  },
})

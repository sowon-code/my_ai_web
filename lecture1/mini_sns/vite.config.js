import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/my_ai_web/mini_sns/',
  plugins: [react()],
})

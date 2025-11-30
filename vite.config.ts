import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path - always use repo name for production builds
  base: process.env.GITHUB_ACTIONS ? '/all-cards-on-the-table/' : '/',
})


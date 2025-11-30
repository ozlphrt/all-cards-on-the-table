import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path - use repo name for GitHub Pages deployment
  base: process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production' ? '/all-cards-on-the-table/' : '/',
})


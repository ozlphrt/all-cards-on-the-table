import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base path - update this to match your repository name
  base: process.env.NODE_ENV === 'production' ? '/all-cards-on-the-table/' : '/',
})


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base is '/' when using a custom domain; set to '/bryllupsgave/' for GitHub Pages project site without a domain.
export default defineConfig({
  base: '/',
  plugins: [react()],
})

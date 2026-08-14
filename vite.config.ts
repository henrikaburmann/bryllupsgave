import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base is '/bryllupsgave/' for GitHub Pages project site; set to '/' when using a custom domain.
export default defineConfig({
  base: '/',
  plugins: [react()],
})

// // https://vite.dev/config/
// // base is '/bryllupsgave/' for GitHub Pages project site; set to '/' when using a custom domain.
// export default defineConfig({
//   base: '/bryllupsgave/',
//   plugins: [react()],
// })
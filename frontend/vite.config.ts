import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // === This is what makes @/ work in runtime ===
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optional: better error messages during development
  server: {
    fs: {
      strict: true,
    },
  },
})
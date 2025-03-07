import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@tauri-apps/api"], // Prevent Vite from trying to pre-bundle it
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env': {}, // Prevents Vite errors related to process.env
  }
})

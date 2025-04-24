import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    hmr: true,
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
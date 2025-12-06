import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // Important for Docker
    port: 5173,
    watch: {
      usePolling: true  // Important for file watching in Docker
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})


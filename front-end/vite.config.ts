import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "/src/sass/variables.scss" as *;
        @use "/src/sass/mixins.scss" as *;
        `,
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  plugins: [react()],
})

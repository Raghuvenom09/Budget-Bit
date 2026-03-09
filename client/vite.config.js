import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Rolldown in Vite 8 beta can't find tslib inside @supabase modules
      'tslib': path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'tslib'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // 将 React 等第三方依赖拆分为独立 chunk，应用代码更新时可走浏览器缓存
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
})

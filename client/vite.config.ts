import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/hello': {
        target: 'http://localhost:8080', // Flask 애플리케이션의 주소
        changeOrigin: true,
      },
      '/hello(.*)': {
        target: 'http://localhost:8080', // Flask 애플리케이션의 주소
        changeOrigin: true,
      },
      '/api(.*)': {
        target: 'http://localhost:8080', // Flask 애플리케이션의 주소
        changeOrigin: true,
      },
    }
  }
})

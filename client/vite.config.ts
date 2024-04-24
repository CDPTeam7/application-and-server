import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import wyw from "@wyw-in-js/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wyw({
      include:['**/*.{ts,tsx}'],
      babelOptions:{
        presets: ['@babel/preset-typescript', '@babel/preset-react']
      }
    })
  ],
  resolve:{
    alias:[
      {
        find:"@",
        replacement: path.resolve(__dirname, 'src'),
      }
    ]
  },
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

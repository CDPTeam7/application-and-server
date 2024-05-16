import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import { VitePWA } from "vite-plugin-pwa";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    react(),
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Ecoce",
        short_name: "Ecoce",
        description: "페트병 재활용을 통한 환경보호 실천",
        theme_color: "#8bc34a",
        background_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
  server: {
    proxy: {
      "/hello": {
        target: "https://localhost:8080", // Flask 애플리케이션의 주소
        secure: false,
        changeOrigin: true,
      },
      "/hello(.*)": {
        target: "https://localhost:8080", // Flask 애플리케이션의 주소
        secure: false,
        changeOrigin: true,
      },
      "/api": {
        target: "https://localhost:8080", // Flask 애플리케이션의 주소
        secure: false,
        changeOrigin: true,
      },
    },
  },
});

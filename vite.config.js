import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],

  server: {
    port: 5173,
    host: "0.0.0.0",
    cors: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "walkouthr.in",
      ".walkouthr.in",
      "walkoutssms.com",
      ".walkoutssms.com",
    ],
  },

  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: "terser",

    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          redux: ["react-redux", "@reduxjs/toolkit"],
          charts: ["recharts"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});

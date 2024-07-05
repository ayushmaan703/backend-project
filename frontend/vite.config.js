import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: "/src/main.jsx",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8000/api/v1",
    },
  },
});

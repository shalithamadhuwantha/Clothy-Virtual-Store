import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    rollupOptions: {
      input: "src/main.js",
      output: {
        dir: "dist",
        format: "es", 
      },
    },
  },
});

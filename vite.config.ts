import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()] as any,
  server: {
    host: true, // escucha en 0.0.0.0
    port: 5173,
    strictPort: true,
  },
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  mode: "development",
  build: {
    minify: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/popup/[name].js",
        chunkFileNames: "assets/popup/[name].js",
        assetFileNames: "assets/popup/[name].[ext]"
      }
    }
  }
})

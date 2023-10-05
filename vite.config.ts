import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb','**/*.env','**/*.hdr'],
  server: { https: true, port:8080 },
  plugins: [
    react(),
    basicSsl()
  ],
})

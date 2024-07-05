import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':'https://backend-projectserver-hkofxu0rr-ayushmaan703s-projects.vercel.app/api/v1'
    }
  }
})

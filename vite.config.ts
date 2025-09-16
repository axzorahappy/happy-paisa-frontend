import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    server: {
      port: 5173,
      open: true,
    },
    plugins: [react()],
  }
})


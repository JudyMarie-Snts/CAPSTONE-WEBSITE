import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Allows opening built files via file:// by making asset paths relative
  base: './',
})



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — sayt istalgan papkada ishlaydi (masalan royalfix.uz/safar/)
export default defineConfig({ plugins: [react()], base: './' })

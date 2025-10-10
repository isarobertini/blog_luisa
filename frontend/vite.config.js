import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),        // 👈 enables automatic JSX transform
    tailwindcss(),  // 👈 enables Tailwind
  ],
})

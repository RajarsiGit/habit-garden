import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Habit Garden',
        short_name: 'Habit Garden',
        description: 'A visual habit tracker where consistency grows a garden.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ecfccb',
        theme_color: '#ecfccb',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App-shell + assets only — habit data lives in localStorage, not
        // anything worth caching network responses for.
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
    }),
  ],
})

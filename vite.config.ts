import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.jpg', 'icons/*.svg', 'icons/*.png'],
      manifest: {
        name: 'Shine Hygiene Solutions — Instant Quote Engine',
        short_name: 'Shine Hygiene',
        description: 'Instant multi-vertical cleaning quotes for commercial, residential, office, car detailing, and HygieneMart wholesale orders.',
        theme_color: '#118bce',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        id: '/',
        scope: '/',
        categories: ['business', 'lifestyle'],
        icons: [
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/wa\.me\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
})

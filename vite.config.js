import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Daily Plan',
        short_name: 'Daily Plan',
        description: "Personal daily app",
        background_color: '#F8F9FA',
        theme_color: '#F8F9FA',
        orientation: "portrait-primary",
        // Cores padrão (tema claro)
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        // Configuração para tema escuro (ainda experimental)
        theme_variations: [
          {
            media: '(prefers-color-scheme: dark)',
            theme_color: '#1E1E2E',
            background_color: '#1E1E2E'
          }
        ]
      },
    }),
  ],
});
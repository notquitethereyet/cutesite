// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  base: "/cutesite/",
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Optimize assets including videos
      assetsInlineLimit: 0, // Don't inline any assets (keep as separate files)
      rollupOptions: {
        output: {
          // Optimize asset filenames
          assetFileNames: 'assets/[name].[hash][extname]',
          // Optimize chunk filenames
          chunkFileNames: 'assets/chunks/[name].[hash].js',
          // Optimize entry filenames
          entryFileNames: 'assets/[name].[hash].js',
        }
      }
    },
    // Configure video handling
    assetsInclude: ['**/*.webm'],
    // Optimize video compression
    optimizeDeps: {
      exclude: ['astro:assets']
    }
  },
  image: {
    // Image optimization settings
    service: {
      // Default image service options
      entrypoint: 'astro/assets/services/sharp',
      config: {
        // Quality for WebP images (0-100)
        quality: 80,
        // Formats to generate
        formats: ['webp', 'avif', 'png', 'jpeg'],
      }
    },
    // Allow SVG files to be processed
    allowStaticImages: true,
    // Domains that are allowed to be optimized
    domains: [],
    // Remote patterns that are allowed to be optimized
    remotePatterns: [{ protocol: "https" }]
  }
});
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/NFL_Porto/',
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: 'index.html',
        detail: 'src/project-detail.html'
      }
    }
  }
})  
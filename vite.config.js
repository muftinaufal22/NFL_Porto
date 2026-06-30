import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/NFL_Porto/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projectDetail: resolve(__dirname, 'src/project-detail.html'),
      }
    }
  }
})
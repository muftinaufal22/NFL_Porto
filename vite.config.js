export default defineConfig({
  build: {
    outDir: 'docs',  // ganti dari dist ke docs
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projectDetail: resolve(__dirname, 'src/project-detail.html'),
      }
    }
  }
})
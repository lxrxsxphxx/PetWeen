import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // path alias für src/ (krise wenn nich also auf jedenfall drin lassen)
      'src': path.resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'test/setup.ts',
    deps: { inline: ['quasar'] }
  }
})




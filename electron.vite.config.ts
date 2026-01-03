import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    server: {
      headers: {
        // ⚠️ РЕШЕНИЕ для ошибки CSP с Blob URL
        // Эта директива разрешает загрузку изображений из Blob URL
        'Content-Security-Policy': "img-src 'self' data: blob:;"
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@common': resolve('src/common')
      }
    }
  },
  preload: {
    server: {
      headers: {
        // ⚠️ РЕШЕНИЕ для ошибки CSP с Blob URL
        // Эта директива разрешает загрузку изображений из Blob URL
        'Content-Security-Policy': "img-src 'self' data: blob:;"
      }
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@common': resolve('src/common')
      }
    }
  },
  renderer: {
    server: {
      headers: {
        // ⚠️ РЕШЕНИЕ для ошибки CSP с Blob URL
        // Эта директива разрешает загрузку изображений из Blob URL
        'Content-Security-Policy': "img-src 'self' data: blob:;"
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, './src/renderer/src'),
        '@common': resolve(__dirname, './src/common')
      }
    },
    plugins: [react()],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    build: {
      rollupOptions: {
        external: ['electron', '@main/*', '@preload/*'], // Запрещаем импорт из других процессов
        input: {
          main: resolve('src/renderer/index.html')
        }
      }
    }
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  base: './',
  plugins: [
    vue(),
    // 自动导入 Vue 和 Element Plus
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex', 'vue-i18n'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-import.d.ts',
      eslintrc: {
        enabled: true
      }
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '_c': resolve(__dirname, 'src/components')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "element-plus/theme-chalk/src/common/var.scss" as *;`
      }
    }
  },
  server: {
    port: 8080,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型库分离到独立 chunk
          'codemirror': ['codemirror', '@codemirror/lang-javascript', '@codemirror/theme-one-dark', 'vue-codemirror'],
          'vue-vendor': ['vue', 'vue-router', 'vuex', 'vue-i18n'],
          'ui-utils': ['js-beautify', 'clipboard']
        },
        // 优化 chunk 文件名
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/i.test(assetInfo.name)) {
            return 'assets/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // 开启代码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    }
  }
})

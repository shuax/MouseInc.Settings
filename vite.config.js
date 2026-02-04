import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  root: '.',
  base: '/mouseinc/',
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    // 自动导入 Vue 和 Element Plus
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex', 'vue-i18n'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-import.d.ts'
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
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: false, // 禁用 CSS 拆分
    rollupOptions: {
      output: {
        // 简化分包逻辑，减少文件数量
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'vuex', 'vue-i18n', 'element-plus', 'js-beautify', 'clipboard', 'jsonrepair']
        },
        // 重新添加 [hash] 以解决缓存和版本控制问题
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
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

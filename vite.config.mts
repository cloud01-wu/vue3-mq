import Vue from '@vitejs/plugin-vue'
import EslintPlugin from 'vite-plugin-eslint'
import path from 'path'
import dts from 'vite-plugin-dts'

export default {
  plugins: [
    Vue({
      reactivityTransform: true
    }),
    dts({
      include: ['src'],
      rollupTypes: true
    }),
    EslintPlugin({
      cache: false,
      include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
    })
  ],
  resolve: {
    alias: {
      'vue3-mq': path.resolve(__dirname, './src/index.ts')
    }
  },
  define: {
    // enable hydration mismatch details in production build
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Vue3Mq',
      formats: ['es', 'umd', 'cjs', 'iife'],
      fileName: (format: string) => (format === 'es' ? 'index.js' : `index.${format}.js`)
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  server: {
    port: 5880,
    hmr: {
      overlay: false
    },
    host: '0.0.0.0'
  }
}

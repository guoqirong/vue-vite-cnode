import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const AutoImport = require('unplugin-auto-import/vite');
const Components = require('unplugin-vue-components/vite');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';
import qiankun from 'vite-plugin-qiankun';
import html from "@rollup/plugin-html";
const fs = require('fs');
const path = require('path');
const { name } = require('./package');
const entryHtml = fs.readFileSync("./index.html", { encoding: "utf-8" });
// useDevMode 开启时与热更新插件冲突,使用变量切换
const useDevMode = true

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: {       // 允许子应用跨域
      exposedHeaders: [
        'Access-Control-Allow-Origin: *',
      ],
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    qiankun(name, {
      useDevMode
    }),
    {
      name: "build html",
      apply: "build",
      ...html({
        template: () => {
          return entryHtml
            .replace(
              "<!-- style placeholder -->",
              '<link rel="stylesheet" type="text/css" href="style.css" rel="external nofollow"  />',
            )
            .replace(
              '<script type="module" src="/src/main.ts" ignored></script>',
              `<script type="text/javascript" src="${name}.umd.js"></script>`,
            );
        },
      }),
    },
  ],
  // 非根目录部署设置
  base: '/vue-vite-cnode',
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      name,
      entry: path.resolve(__dirname, './src/main.ts'),
      formats: ['umd'],
    },
    terserOptions: {
      compress: {
        // drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: { //静态资源分类打包
        // chunkFileNames: 'static/js/[name]-[hash].js',
        // entryFileNames: 'static/js/[name]-[hash].js',
        // assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        // manualChunks(id) { //静态资源分拆打包
        //   if (id.includes('node_modules')) {
        //     return id.toString().split('node_modules/')[1].split('/')[0].toString();
        //   }
        // },
        // format: 'umd',
        inlineDynamicImports: true,
      }
    }
  }
})

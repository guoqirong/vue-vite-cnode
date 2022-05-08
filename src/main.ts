import { App as VueApp, createApp } from 'vue';
import { renderWithQiankun, qiankunWindow, QiankunProps } from 'vite-plugin-qiankun/dist/helper';
// 全局引入element ui
// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';
// message样式导入 -- 几乎所有模块都会使用的，故在全局引入
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import App from './App.vue';
import router from './router';
import store from './store';

// createApp(App)
// // 全局引入element ui
// // .use(ElementPlus)
// .use(store)
// .use(router)
// .mount('#app');
let instance: VueApp | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function render(props?: { [key: string]: any; } | undefined) {
  const { container, entry } = props ?? {};
  // 为了避免根id#app与其他DOM冲突，需要限制查找范围
  instance = createApp(App);
  instance.use(store).use(router).mount(container ? container.querySelector('#app') : '#app');
  // 设置父应用请求子应用路径
  store.commit('grobal/updateEntryUrl', entry);
}

renderWithQiankun({
  bootstrap() {
    console.log('bootstrap');
  },
  mount(props) {
    console.log('mount', props);
    render(props);
  },
  update: function (props: QiankunProps): void | Promise<void> {
    console.log(props);
    throw new Error('Function not implemented.');
  },
  unmount(props: any) {
    if (instance) {
      console.log('[vue] vue app unmount')
      // 清除父应用请求子应用路径
      store.commit('grobal/updateEntryUrl', '');
      instance.unmount();
      instance._instance = null;
      instance = undefined;
    }
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
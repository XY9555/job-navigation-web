import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Lazyload } from 'vant'
import 'vant/lib/index.css'
import './styles/global.css'
import { OfflineHandler } from './utils/offline-handler.js'
import networkChecker from './utils/network-checker.js'

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
  event.preventDefault(); // 防止应用崩溃
});

const app = createApp(App)

// 全局错误处理器
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err, info);
  // 在生产环境中，可以发送错误报告到服务器
};

app.use(router)
app.use(Lazyload)

// 设置离线处理
OfflineHandler.setupOfflineHandling();

// 移除启动时的网络检查，允许应用正常启动
console.log('📱 移动端应用已启动，跳过网络检查');

app.mount('#app')




import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jobnavigation.app',
  appName: '求职导航',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    // 开发模式下使用本地开发服务器
    url: 'http://192.168.112.212:8080', // 使用实际IP地址，支持真机调试
    cleartext: true,
    allowNavigation: ['*']
  },
  plugins: {
    StatusBar: {
      style: 'DARK_CONTENT',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    }
  }
};

export default config;




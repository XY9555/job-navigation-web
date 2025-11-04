// 网络连接测试工具
import { API_CONFIG } from '@/config/api-config.js';

// 测试网络连接
export const testNetworkConnection = async () => {
  console.log('🔍 开始网络连接测试...');
  
  const results = {
    apiServer: false,
    internetConnection: false,
    details: {}
  };
  
  try {
    // 1. 测试互联网连接
    console.log('📡 测试互联网连接...');
    const internetResponse = await fetch('https://www.baidu.com', {
      method: 'HEAD',
      mode: 'no-cors',
      timeout: 5000
    });
    results.internetConnection = true;
    console.log('✅ 互联网连接正常');
  } catch (error) {
    console.log('❌ 互联网连接失败:', error.message);
    results.details.internetError = error.message;
  }
  
  try {
    // 2. 测试API服务器连接
    console.log('🖥️ 测试API服务器连接:', API_CONFIG.BASE_URL);
    const apiResponse = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (apiResponse.ok) {
      results.apiServer = true;
      console.log('✅ API服务器连接成功');
    } else {
      throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
    }
  } catch (error) {
    console.log('❌ API服务器连接失败:', error.message);
    results.details.apiError = error.message;
    
    // 提供详细的错误信息和解决建议
    if (error.message.includes('ERR_CONNECTION_TIMED_OUT')) {
      results.details.suggestion = '连接超时，请检查：\n1. 后端服务是否启动\n2. IP地址是否正确\n3. 防火墙设置';
    } else if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      results.details.suggestion = '连接被拒绝，请检查：\n1. 后端服务端口是否正确\n2. 服务是否正在运行';
    } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      results.details.suggestion = 'DNS解析失败，请检查网络连接';
    }
  }
  
  return results;
};

// 获取设备网络信息
export const getNetworkInfo = () => {
  const info = {
    platform: window.Capacitor ? window.Capacitor.getPlatform() : 'web',
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    apiUrl: API_CONFIG.BASE_URL
  };
  
  console.log('📱 设备网络信息:', info);
  return info;
};

// 显示网络诊断结果
export const showNetworkDiagnostics = async () => {
  const networkInfo = getNetworkInfo();
  const testResults = await testNetworkConnection();
  
  const diagnostics = {
    ...networkInfo,
    ...testResults,
    timestamp: new Date().toISOString()
  };
  
  console.log('🔧 网络诊断结果:', diagnostics);
  
  // 生成用户友好的诊断报告
  let report = `网络诊断报告\n`;
  report += `时间: ${new Date().toLocaleString()}\n`;
  report += `平台: ${diagnostics.platform}\n`;
  report += `API地址: ${diagnostics.apiUrl}\n\n`;
  
  if (diagnostics.internetConnection) {
    report += `✅ 互联网连接: 正常\n`;
  } else {
    report += `❌ 互联网连接: 失败\n`;
  }
  
  if (diagnostics.apiServer) {
    report += `✅ API服务器: 连接成功\n`;
  } else {
    report += `❌ API服务器: 连接失败\n`;
    if (diagnostics.details.suggestion) {
      report += `💡 建议: ${diagnostics.details.suggestion}\n`;
    }
  }
  
  return { diagnostics, report };
};
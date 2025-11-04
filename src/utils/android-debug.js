// Android调试工具
export class AndroidDebugger {
  static log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    console.log(logMessage, data);
    
    // 在Android环境中，也可以通过alert显示重要信息
    if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
      // 存储日志到localStorage，方便调试
      const logs = JSON.parse(localStorage.getItem('androidDebugLogs') || '[]');
      logs.push({ timestamp, message, data });
      
      // 只保留最近100条日志
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('androidDebugLogs', JSON.stringify(logs));
    }
  }
  
  static showLogs() {
    if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
      const logs = JSON.parse(localStorage.getItem('androidDebugLogs') || '[]');
      const logText = logs.map(log => `${log.timestamp}: ${log.message}`).join('\n');
      alert('调试日志:\n' + logText.slice(-2000)); // 显示最后2000字符
    }
  }
  
  static clearLogs() {
    localStorage.removeItem('androidDebugLogs');
    console.log('调试日志已清除');
  }
  
  static checkNetworkStatus() {
    const isOnline = navigator.onLine;
    const platform = window.Capacitor ? window.Capacitor.getPlatform() : 'web';
    const apiUrl = localStorage.getItem('apiBaseUrl') || 'unknown';
    
    const status = {
      online: isOnline,
      platform: platform,
      apiUrl: apiUrl,
      userToken: !!localStorage.getItem('userToken'),
      timestamp: new Date().toISOString()
    };
    
    this.log('网络状态检查', status);
    return status;
  }
}

// 全局暴露调试工具
if (typeof window !== 'undefined') {
  window.AndroidDebugger = AndroidDebugger;
}
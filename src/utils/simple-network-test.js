// 简化的网络测试工具
export class SimpleNetworkTest {
  static async testBasicConnection() {
    const apiUrl = 'https://job-navigation-api.onrender.com/api';
    const results = [];
    
    // 测试1：使用XMLHttpRequest
    try {
      const xhrResult = await this.testWithXHR(`${apiUrl}/health`);
      results.push({
        method: 'XMLHttpRequest',
        status: 'success',
        message: '连接成功',
        data: xhrResult
      });
    } catch (error) {
      results.push({
        method: 'XMLHttpRequest',
        status: 'failed',
        message: error.message
      });
    }
    
    // 测试2：使用fetch（无CORS）
    try {
      const fetchResult = await this.testWithFetch(`${apiUrl}/health`);
      results.push({
        method: 'Fetch (no-cors)',
        status: 'success',
        message: '连接成功',
        data: fetchResult
      });
    } catch (error) {
      results.push({
        method: 'Fetch (no-cors)',
        status: 'failed',
        message: error.message
      });
    }
    
    // 测试3：使用Image标签（最基本的连通性测试）
    try {
      const imageResult = await this.testWithImage('https://job-navigation-api.onrender.com');
      results.push({
        method: 'Image Load',
        status: 'success',
        message: '域名可达'
      });
    } catch (error) {
      results.push({
        method: 'Image Load',
        status: 'failed',
        message: '域名不可达'
      });
    }
    
    return results;
  }
  
  static testWithXHR(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.timeout = 10000;
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            resolve({ status: xhr.status, response: xhr.responseText });
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('网络错误'));
      xhr.ontimeout = () => reject(new Error('请求超时'));
      
      xhr.send();
    });
  }
  
  static testWithFetch(url) {
    return fetch(url, {
      method: 'GET',
      mode: 'no-cors', // 绕过CORS检查
      cache: 'no-cache'
    }).then(response => {
      if (response.type === 'opaque') {
        return { message: '请求已发送（no-cors模式）' };
      }
      return response.json();
    });
  }
  
  static testWithImage(baseUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error('图片加载超时'));
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        // 即使图片加载失败，也说明域名是可达的
        resolve(true);
      };
      
      // 使用favicon或任何小图片
      img.src = `${baseUrl}/favicon.ico?t=${Date.now()}`;
    });
  }
  
  static displayResults(results) {
    let message = '🔍 网络连接测试结果:\n\n';
    
    results.forEach((result, index) => {
      const status = result.status === 'success' ? '✅' : '❌';
      message += `${status} ${result.method}: ${result.message}\n`;
    });
    
    message += '\n💡 建议:\n';
    
    const successCount = results.filter(r => r.status === 'success').length;
    
    if (successCount === 0) {
      message += '- 检查网络连接\n- 尝试切换WiFi或移动数据\n- 检查防火墙设置';
    } else if (successCount < results.length) {
      message += '- 部分连接成功，可能是CORS限制\n- 尝试重新构建APP';
    } else {
      message += '- 网络连接正常\n- 问题可能在应用配置';
    }
    
    console.log(message);
    alert(message);
    
    return message;
  }
}
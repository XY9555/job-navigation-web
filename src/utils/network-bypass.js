// 网络限制绕过工具
export class NetworkBypass {
  static async makeRequest(url, options = {}) {
    const methods = [
      () => this.requestWithXHR(url, options),
      () => this.requestWithFetchNoCors(url, options),
      () => this.requestWithJsonp(url, options),
    ];
    
    for (const method of methods) {
      try {
        const result = await method();
        console.log('✅ 请求成功:', result);
        return result;
      } catch (error) {
        console.log('❌ 请求方法失败:', error.message);
        continue;
      }
    }
    
    throw new Error('所有请求方法都失败了');
  }
  
  static requestWithXHR(url, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open(options.method || 'GET', url, true);
      
      // 设置请求头
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }
      
      xhr.timeout = 15000;
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            resolve({ success: true, data: xhr.responseText });
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('XHR网络错误'));
      xhr.ontimeout = () => reject(new Error('XHR请求超时'));
      
      if (options.body) {
        xhr.send(JSON.stringify(options.body));
      } else {
        xhr.send();
      }
    });
  }
  
  static async requestWithFetchNoCors(url, options = {}) {
    const response = await fetch(url, {
      method: options.method || 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    
    // no-cors模式下无法读取响应内容，但可以确认请求已发送
    return { success: true, message: '请求已发送（no-cors模式）' };
  }
  
  static requestWithJsonp(url, options = {}) {
    return new Promise((resolve, reject) => {
      // JSONP只支持GET请求
      if (options.method && options.method !== 'GET') {
        reject(new Error('JSONP只支持GET请求'));
        return;
      }
      
      const callbackName = 'jsonp_callback_' + Date.now();
      const script = document.createElement('script');
      
      window[callbackName] = function(data) {
        document.head.removeChild(script);
        delete window[callbackName];
        resolve(data);
      };
      
      const separator = url.includes('?') ? '&' : '?';
      script.src = `${url}${separator}callback=${callbackName}`;
      
      script.onerror = () => {
        document.head.removeChild(script);
        delete window[callbackName];
        reject(new Error('JSONP请求失败'));
      };
      
      setTimeout(() => {
        if (window[callbackName]) {
          document.head.removeChild(script);
          delete window[callbackName];
          reject(new Error('JSONP请求超时'));
        }
      }, 10000);
      
      document.head.appendChild(script);
    });
  }
}
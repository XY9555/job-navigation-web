// 测试登录API
const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🌐 测试登录API');
    console.log('================================');
    
    const loginData = {
      phone: '13800138000',
      password: '123456'
    };
    
    console.log('📱 登录数据:', loginData);
    
    const response = await axios.post('http://localhost:3000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    console.log('✅ 登录成功!');
    console.log('响应状态:', response.status);
    console.log('响应数据:', response.data);
    
  } catch (error) {
    console.error('❌ 登录失败');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else if (error.request) {
      console.error('网络错误:', error.message);
    } else {
      console.error('其他错误:', error.message);
    }
  }
}

testLoginAPI();
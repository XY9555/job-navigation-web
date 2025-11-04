// 测试带认证的保存功能
const axios = require('axios');

async function testSaveWithAuth() {
  try {
    console.log('🔐 测试带认证的保存功能');
    console.log('================================');
    
    // 1. 先登录获取token
    console.log('1️⃣ 登录获取token...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      phone: '13800138000',
      password: '123456'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('登录失败');
    }
    
    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功，token:', token.substring(0, 20) + '...');
    
    // 2. 使用token保存评测结果
    console.log('\n2️⃣ 保存评测结果...');
    const saveData = {
      title: '测试评测结果 - ' + new Date().toLocaleString(),
      evaluationData: {
        score: 85,
        strengths: ['技能匹配度高', '经验丰富'],
        weaknesses: ['需要完善项目描述'],
        suggestions: ['添加更多技术细节'],
        evaluationMode: 'test'
      },
      sourceInfo: {
        type: 'test',
        timestamp: new Date().toISOString()
      }
    };
    
    const saveResponse = await axios.post(
      'http://localhost:3000/api/resumes/save-evaluation-result',
      saveData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ 保存成功!');
    console.log('响应数据:', saveResponse.data);
    
    // 3. 验证保存的记录
    console.log('\n3️⃣ 验证保存的记录...');
    const resumesResponse = await axios.get('http://localhost:3000/api/resumes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📋 当前简历列表:');
    resumesResponse.data.data.forEach(resume => {
      console.log(`- ID: ${resume.id}, 标题: ${resume.title}, 类型: ${resume.type || '普通简历'}`);
    });
    
  } catch (error) {
    console.error('❌ 测试失败');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else {
      console.error('错误:', error.message);
    }
  }
}

testSaveWithAuth();
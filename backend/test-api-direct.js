// 直接测试API调用
const fetch = require('node-fetch');

async function testAPI() {
  try {
    // 1. 登录
    console.log('🔐 登录...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '13800138000',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('登录结果:', loginData.success);
    
    if (!loginData.success) {
      console.error('登录失败:', loginData.message);
      return;
    }
    
    const token = loginData.data.token;
    
    // 2. 调用面试问题生成API
    console.log('\n🤖 调用面试问题生成API...');
    const interviewResponse = await fetch('http://localhost:3000/api/ai/interview-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        resumeId: 1,
        jobPosition: '前端开发工程师',
        focusAreas: ['skills', 'projects'],
        questionCount: 3
      })
    });
    
    console.log('HTTP状态码:', interviewResponse.status);
    
    const interviewData = await interviewResponse.json();
    console.log('API响应:', JSON.stringify(interviewData, null, 2));
    
    if (interviewData.success) {
      console.log('\n✅ API调用成功!');
      console.log('问题数量:', interviewData.data.questions.length);
      interviewData.data.questions.forEach((q, i) => {
        console.log(`\n问题${i+1}: ${q.question.substring(0, 50)}...`);
      });
    } else {
      console.log('\n❌ API调用失败:', interviewData.message);
    }
    
  } catch (error) {
    console.error('💥 测试失败:', error.message);
  }
}

testAPI();
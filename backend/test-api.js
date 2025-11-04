// 测试文件解析API
const fs = require('fs');
const path = require('path');

async function testParseAPI() {
  console.log('🧪 测试文件解析API...');
  
  // 创建测试文件
  const testContent = `张三 - 前端开发工程师简历

个人信息：
姓名：张三
电话：13800138000
邮箱：zhangsan@example.com
性别：男
年龄：25岁

求职意向：
期望职位：前端开发工程师
期望薪资：15-20K

技能：
JavaScript、Vue.js、React、Node.js、HTML、CSS`;

  const testFilePath = path.join(__dirname, 'test-resume.txt');
  fs.writeFileSync(testFilePath, testContent, 'utf8');
  
  try {
    // 先登录获取token
    console.log('🔐 正在登录...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '13800138000',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginData.success) {
      throw new Error('登录失败: ' + loginData.message);
    }
    
    const token = loginData.data.token;
    console.log('✅ 登录成功');
    
    // 测试文件解析API
    console.log('📤 上传测试文件...');
    
    const formData = new FormData();
    const fileBlob = new Blob([testContent], { type: 'text/plain' });
    formData.append('file', fileBlob, 'test-resume.txt');
    
    const parseResponse = await fetch('http://localhost:3000/api/ai/parse-file', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const parseData = await parseResponse.json();
    console.log('📄 解析响应:', parseData);
    
    if (parseData.success) {
      console.log('✅ 文件解析成功!');
      console.log('📋 解析结果:', JSON.stringify(parseData.data.parsedContent, null, 2));
    } else {
      console.log('❌ 文件解析失败:', parseData.message);
    }
    
  } catch (error) {
    console.error('💥 测试失败:', error.message);
  } finally {
    // 清理测试文件
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

// 运行测试
testParseAPI().then(() => {
  console.log('🏁 API测试完成');
}).catch(error => {
  console.error('💥 API测试异常:', error);
});
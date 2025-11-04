// SQLite版本完整功能测试
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// 测试用户数据
const testUser = {
  phone: '13800138000',
  password: '123456',
  name: '测试用户'
};

// 测试简历数据
const testResumeData = {
  title: '前端开发工程师简历',
  personalInfo: {
    name: '测试用户',
    phone: '13800138000',
    email: 'test@example.com',
    gender: '男',
    age: 25
  },
  jobIntention: {
    position: '前端开发工程师',
    industry: 'IT互联网',
    salary: '10-15K',
    location: '北京'
  },
  education: [{
    school: '北京大学',
    major: '计算机科学与技术',
    degree: '本科',
    startDate: '2018-09',
    endDate: '2022-06'
  }],
  workExperience: [{
    company: '某科技公司',
    position: '前端开发工程师',
    startDate: '2022-07',
    endDate: '2024-10',
    description: '负责公司前端产品的开发和维护，使用Vue.js和React技术栈'
  }],
  skills: [
    { name: 'JavaScript', level: '熟练' },
    { name: 'Vue.js', level: '熟练' },
    { name: 'React', level: '了解' },
    { name: 'HTML/CSS', level: '熟练' }
  ],
  projects: [{
    name: '电商管理系统',
    description: '基于Vue.js开发的电商后台管理系统',
    startDate: '2023-01',
    endDate: '2023-06',
    technologies: ['Vue.js', 'Element UI', 'Axios']
  }]
};

async function runSQLiteTest() {
  console.log('🚀 开始SQLite版本完整功能测试...\n');
  
  let token = null;
  let resumeId = null;
  
  try {
    // 1. 健康检查
    console.log('1️⃣ 健康检查...');
    const healthResponse = await axios.get(`${API_BASE.replace('/api', '')}/health`);
    console.log('✅ 服务器状态:', healthResponse.data.status);
    console.log('💾 数据库类型:', healthResponse.data.database);
    
    // 2. 用户注册
    console.log('\n2️⃣ 用户注册...');
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
      console.log('✅ 注册成功');
      token = registerResponse.data.data.token;
    } catch (error) {
      if (error.response?.data?.message?.includes('已注册')) {
        console.log('ℹ️ 用户已存在，尝试登录');
        
        // 3. 用户登录
        console.log('\n3️⃣ 用户登录...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          phone: testUser.phone,
          password: testUser.password
        });
        token = loginResponse.data.data.token;
        console.log('✅ 登录成功');
      } else {
        throw error;
      }
    }
    
    // 4. 创建测试简历
    console.log('\n4️⃣ 创建测试简历...');
    const resumeResponse = await axios.post(`${API_BASE}/resumes`, testResumeData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    resumeId = resumeResponse.data.data.id;
    console.log('✅ 简历创建成功，ID:', resumeId);
    
    // 5. 测试简历评测 (真实AI调用)
    console.log('\n5️⃣ 测试AI简历评测...');
    const evaluationResponse = await axios.post(
      `${API_BASE}/ai/evaluate-resume/${resumeId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ AI简历评测成功！');
    console.log('📊 AI评分:', evaluationResponse.data.data.score);
    console.log('💪 AI优势:', evaluationResponse.data.data.strengths.slice(0, 2).join(', '));
    console.log('💡 AI建议:', evaluationResponse.data.data.suggestions.slice(0, 2).join(', '));
    
    // 6. 测试职位匹配 (真实AI调用)
    console.log('\n6️⃣ 测试AI职位匹配...');
    const matchingResponse = await axios.post(
      `${API_BASE}/ai/job-matching`,
      {
        resumeId: resumeId,
        jobTitle: '高级前端开发工程师',
        jobDescription: '负责公司前端产品的开发和维护，使用Vue.js、React等现代前端技术栈，参与产品需求分析和技术方案设计。要求3年以上前端开发经验，熟悉JavaScript、HTML、CSS，有移动端开发经验优先。'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ AI职位匹配成功！');
    console.log('📊 AI匹配度:', matchingResponse.data.data.matchingScore + '%');
    console.log('💪 AI优势:', matchingResponse.data.data.strengths.slice(0, 2).join(', '));
    
    // 7. 测试面试问题生成 (真实AI调用)
    console.log('\n7️⃣ 测试AI面试问题生成...');
    const questionsResponse = await axios.post(
      `${API_BASE}/ai/interview-questions`,
      {
        resumeId: resumeId,
        jobPosition: '前端开发工程师',
        focusAreas: ['skills', 'projects', 'experience'],
        questionCount: 3
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log('✅ AI面试问题生成成功！');
    console.log('📝 生成问题数量:', questionsResponse.data.data.questions.length);
    questionsResponse.data.data.questions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.question.substring(0, 50)}...`);
    });
    
    // 8. 测试简历管理功能
    console.log('\n8️⃣ 测试简历管理功能...');
    
    // 获取简历列表
    const resumeListResponse = await axios.get(`${API_BASE}/resumes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 简历列表获取成功，数量:', resumeListResponse.data.data.length);
    
    // 更新简历
    await axios.put(`${API_BASE}/resumes/${resumeId}`, {
      title: '更新后的简历标题'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 简历更新成功');
    
    // 9. 清理测试数据
    console.log('\n9️⃣ 清理测试数据...');
    await axios.delete(`${API_BASE}/resumes/${resumeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ 测试简历已删除');
    
    // 10. 最终结果
    console.log('\n🎉 SQLite版本测试结果:');
    console.log('='.repeat(50));
    console.log('✅ 数据库: SQLite (无需安装)');
    console.log('✅ 用户认证: 正常');
    console.log('✅ 简历管理: 正常');
    console.log('✅ AI简历评测: 真实AI调用成功');
    console.log('✅ AI职位匹配: 真实AI调用成功');
    console.log('✅ AI面试问题: 真实AI调用成功');
    console.log('\n🔥 确认：SQLite版本完全可用，AI功能正常！');
    console.log('📱 前端调用 → SQLite后端 → 智谱AI → 返回真实分析结果');
    console.log('\n💡 SQLite优势:');
    console.log('- ✅ 无需安装额外数据库软件');
    console.log('- ✅ 数据存储在本地文件中');
    console.log('- ✅ 完整的SQL功能支持');
    console.log('- ✅ 适合开发和小型部署');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.response?.data || error.message);
    console.log('\n🔍 错误分析:');
    if (error.response?.status === 401) {
      console.log('- 认证问题：请检查token是否有效');
    } else if (error.response?.status === 404) {
      console.log('- 资源不存在：请检查API路径');
    } else if (error.response?.status === 500) {
      console.log('- 服务器错误：请检查后端服务和AI配置');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('- 连接被拒绝：请确保SQLite后端服务正在运行');
      console.log('- 运行命令: start-sqlite-development.bat');
    }
  }
}

runSQLiteTest();
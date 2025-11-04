// 测试简历过滤功能
const axios = require('axios');

async function testResumeFilter() {
  try {
    console.log('🔍 测试简历过滤功能');
    console.log('================================');
    
    // 1. 登录获取token
    console.log('1️⃣ 登录获取token...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      phone: '13800138000',
      password: '123456'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功');
    
    // 2. 获取所有简历记录
    console.log('\n2️⃣ 获取所有简历记录...');
    const resumesResponse = await axios.get('http://localhost:3000/api/resumes', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const allResumes = resumesResponse.data.data;
    console.log('📋 数据库中的所有记录:');
    allResumes.forEach(resume => {
      const type = resume.evaluation ? '📊评测结果' : 
                   resume.jobMatching ? '🎯匹配分析' : '📄普通简历';
      console.log(`- ID: ${resume.id}, 标题: ${resume.title}, 类型: ${type}`);
    });
    
    // 3. 模拟前端过滤逻辑
    console.log('\n3️⃣ 应用前端过滤逻辑...');
    const filteredResumes = allResumes.filter(resume => {
      return !resume.evaluation && !resume.jobMatching;
    });
    
    console.log('📋 过滤后的简历列表（前端应该显示的）:');
    if (filteredResumes.length === 0) {
      console.log('- 没有普通简历');
    } else {
      filteredResumes.forEach(resume => {
        console.log(`- ID: ${resume.id}, 标题: ${resume.title}`);
      });
    }
    
    console.log('\n📊 统计信息:');
    console.log(`- 总记录数: ${allResumes.length}`);
    console.log(`- 评测结果记录: ${allResumes.filter(r => r.evaluation).length}`);
    console.log(`- 匹配分析记录: ${allResumes.filter(r => r.jobMatching).length}`);
    console.log(`- 普通简历记录: ${filteredResumes.length}`);
    
    console.log('\n🎯 结论:');
    if (filteredResumes.length === 0) {
      console.log('⚠️ 没有普通简历，选择列表应该为空或只显示"请选择简历"');
    } else {
      console.log(`✅ 选择列表应该只显示 ${filteredResumes.length} 个普通简历`);
    }
    
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

testResumeFilter();
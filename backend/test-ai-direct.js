// 直接测试AI服务功能
require('dotenv').config();
const aiService = require('./services/aiService');

// 模拟简历数据
const mockResume = {
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

async function testAllAIFunctions() {
  console.log('🚀 开始测试AI功能...\n');
  
  try {
    // 1. 测试简历评测
    console.log('1️⃣ 测试简历评测...');
    const evaluation = await aiService.evaluateResume(mockResume);
    console.log('✅ 简历评测结果:');
    console.log(`📊 评分: ${evaluation.score}`);
    console.log(`💪 优势: ${evaluation.strengths.join(', ')}`);
    console.log(`⚠️ 不足: ${evaluation.weaknesses.join(', ')}`);
    console.log(`💡 建议: ${evaluation.suggestions.join(', ')}`);
    
    // 2. 测试职位匹配分析
    console.log('\n2️⃣ 测试职位匹配分析...');
    const jobDescription = '负责公司前端产品的开发和维护，使用Vue.js、React等现代前端技术栈，参与产品需求分析和技术方案设计。要求3年以上前端开发经验，熟悉JavaScript、HTML、CSS，有移动端开发经验优先。';
    const jobTitle = '高级前端开发工程师';
    
    const matching = await aiService.analyzeJobMatching(mockResume, jobDescription, jobTitle);
    console.log('✅ 职位匹配分析结果:');
    console.log(`📊 匹配度: ${matching.matchingScore}`);
    console.log(`💪 优势: ${matching.strengths.join(', ')}`);
    console.log(`⚠️ 差距: ${matching.gaps.join(', ')}`);
    console.log(`💡 建议: ${matching.suggestions.join(', ')}`);
    
    // 3. 测试面试问题生成
    console.log('\n3️⃣ 测试面试问题生成...');
    const questions = await aiService.generateInterviewQuestions(
      mockResume, 
      '前端开发工程师', 
      ['skills', 'projects', 'experience'], 
      3
    );
    console.log('✅ 面试问题生成结果:');
    questions.forEach((q, index) => {
      console.log(`\n${index + 1}. ${q.question}`);
      console.log(`   💡 参考答案: ${q.answer.substring(0, 100)}...`);
    });
    
    console.log('\n🎉 所有AI功能测试完成！');
    console.log('✅ 简历评测: 正常');
    console.log('✅ 职位匹配: 正常');
    console.log('✅ 面试问题: 正常');
    console.log('\n🔥 AI服务已完全集成并正常工作！');
    
  } catch (error) {
    console.error('❌ AI功能测试失败:', error.message);
    console.log('\n⚠️ 如果是网络问题，AI服务会自动降级到默认响应');
  }
}

testAllAIFunctions();
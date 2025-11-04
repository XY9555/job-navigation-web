// 测试面试问题API
require('dotenv').config();
const aiService = require('./services/aiService');

async function testInterviewAPI() {
  console.log('🧪 测试面试问题生成API...');
  
  // 创建模拟简历数据
  const mockResume = {
    id: 1,
    title: '前端开发工程师简历',
    personalInfo: {
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      gender: '男',
      age: 25
    },
    jobIntention: {
      position: '前端开发工程师',
      salary: '15-20K',
      city: '北京'
    },
    education: [{
      school: '北京大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2018-09',
      endDate: '2022-06'
    }],
    experience: [],
    skills: [
      { name: 'JavaScript', level: 90 },
      { name: 'Vue.js', level: 85 },
      { name: 'React', level: 80 }
    ],
    projects: [{
      name: '电商管理系统',
      role: '前端负责人',
      description: '负责前端架构设计和开发',
      technologies: ['Vue.js', 'Element UI']
    }]
  };
  
  const jobPosition = '前端开发工程师';
  const focusAreas = ['skills', 'projects'];
  const questionCount = 3;
  
  console.log('📋 测试参数:');
  console.log('- 职位:', jobPosition);
  console.log('- 侧重点:', focusAreas.join(', '));
  console.log('- 问题数量:', questionCount);
  
  try {
    console.log('\n🤖 调用AI服务生成面试问题...');
    const questions = await aiService.generateInterviewQuestions(
      mockResume,
      jobPosition,
      focusAreas,
      questionCount
    );
    
    console.log('\n✅ 面试问题生成成功:');
    console.log('📊 问题数量:', questions.length);
    
    questions.forEach((item, index) => {
      console.log(`\n📌 问题 ${index + 1}:`);
      console.log('❓', item.question);
      console.log('💡', item.answer);
    });
    
  } catch (error) {
    console.error('\n❌ 面试问题生成失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

// 运行测试
testInterviewAPI().then(() => {
  console.log('\n🏁 测试完成');
  process.exit(0);
}).catch(error => {
  console.error('💥 测试异常:', error);
  process.exit(1);
});
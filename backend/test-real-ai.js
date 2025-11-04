// 测试真实AI功能
require('dotenv').config();
const aiService = require('./services/aiService');

async function testRealAI() {
  console.log('🧪 测试真实AI功能...');
  console.log('🔑 API Key:', process.env.ZHIPU_API_KEY ? '已配置' : '未配置');
  console.log('🤖 AI提供商:', process.env.AI_PROVIDER || 'zhipu');
  
  // 创建一个测试简历
  const testResume = {
    personalInfo: {
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    jobIntention: {
      position: 'Web前端开发工程师',
      salary: '10-15K',
      city: '北京'
    },
    workExperience: [
      {
        company: '某科技公司',
        position: '前端开发实习生',
        startDate: '2023-01',
        endDate: '2023-12',
        description: '负责公司官网的前端开发，使用Vue.js和Element UI'
      }
    ],
    education: [
      {
        school: '北京大学',
        major: '计算机科学与技术',
        degree: '本科',
        startDate: '2020-09',
        endDate: '2024-06'
      }
    ],
    skills: [
      { name: 'JavaScript', level: 4 },
      { name: 'Vue.js', level: 3 },
      { name: 'HTML/CSS', level: 4 }
    ],
    projects: [
      {
        name: '个人博客系统',
        description: '使用Vue.js + Node.js开发的个人博客',
        technologies: ['Vue.js', 'Node.js', 'MongoDB'],
        startDate: '2023-06',
        endDate: '2023-08'
      }
    ]
  };

  try {
    console.log('\n📋 开始AI简历评测...');
    const evaluation = await aiService.evaluateResume(testResume);
    
    console.log('\n✅ AI评测结果:');
    console.log('📊 总分:', evaluation.score);
    console.log('💪 优势:', evaluation.strengths);
    console.log('⚠️ 不足:', evaluation.weaknesses);
    console.log('💡 建议:', evaluation.suggestions);
    
    // 检查是否是默认结果
    if (evaluation.score === 75 && 
        evaluation.strengths.includes('基本信息完整') &&
        evaluation.weaknesses.includes('需要更多细节描述')) {
      console.log('\n⚠️ 警告：返回的是默认结果，AI可能没有真正调用！');
    } else {
      console.log('\n🎉 成功：AI返回了真实的评测结果！');
    }
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
  }
}

testRealAI();

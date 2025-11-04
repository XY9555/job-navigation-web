// 测试面试问题生成功能
const { Resume } = require('./models');
const aiService = require('./services/aiService');

async function testInterviewQuestions() {
  try {
    console.log('🧪 开始测试面试问题生成功能...');
    
    // 获取第一个简历
    const resume = await Resume.findByPk(1);
    if (!resume) {
      console.error('❌ 未找到测试简历');
      return;
    }
    
    console.log('📄 测试简历:', resume.title);
    
    // 测试参数
    const jobPosition = '前端开发工程师';
    const focusAreas = ['skills', 'projects', 'experience'];
    const questionCount = 5;
    
    console.log('💼 职位:', jobPosition);
    console.log('🎯 侧重点:', focusAreas.join(', '));
    console.log('📝 问题数量:', questionCount);
    
    // 调用AI生成面试问题
    console.log('\n🤖 调用AI生成面试问题...');
    const questions = await aiService.generateInterviewQuestions(
      resume, 
      jobPosition, 
      focusAreas, 
      questionCount
    );
    
    console.log('\n✅ 面试问题生成完成:');
    console.log('📊 生成问题数量:', questions.length);
    
    questions.forEach((item, index) => {
      console.log(`\n📌 问题 ${index + 1}:`);
      console.log('❓ 问题:', item.question);
      console.log('💡 答案:', item.answer);
    });
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

// 运行测试
testInterviewQuestions().then(() => {
  console.log('\n🏁 测试完成');
  process.exit(0);
}).catch(error => {
  console.error('💥 测试异常:', error);
  process.exit(1);
});
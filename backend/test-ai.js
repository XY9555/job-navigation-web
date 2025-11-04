// 测试AI评测功能
const { Resume } = require('./models');
const aiService = require('./services/aiService');

async function testAIEvaluation() {
  try {
    console.log('🧪 开始测试AI评测功能...');
    
    // 获取第一个简历
    const resume = await Resume.findByPk(1);
    if (!resume) {
      console.error('❌ 未找到测试简历');
      return;
    }
    
    console.log('📄 测试简历:', resume.title);
    console.log('📋 简历数据:', JSON.stringify(resume.toJSON(), null, 2));
    
    // 调用AI评测
    console.log('\n🤖 调用AI评测服务...');
    const evaluation = await aiService.evaluateResume(resume);
    
    console.log('\n✅ 评测结果:');
    console.log('📊 总分:', evaluation.score);
    console.log('💪 优势:', evaluation.strengths);
    console.log('⚠️ 不足:', evaluation.weaknesses);
    console.log('💡 建议:', evaluation.suggestions);
    
    if (evaluation.details) {
      console.log('📈 详细评分:', evaluation.details);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

// 运行测试
testAIEvaluation().then(() => {
  console.log('\n🏁 测试完成');
  process.exit(0);
}).catch(error => {
  console.error('💥 测试异常:', error);
  process.exit(1);
});
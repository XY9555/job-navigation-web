// 调试环境变量加载
require('dotenv').config();
const aiService = require('./services/aiService');

console.log('🔍 环境变量调试');
console.log('=' .repeat(40));

console.log('process.env.AI_PROVIDER:', process.env.AI_PROVIDER);
console.log('process.env.ZHIPU_API_KEY:', process.env.ZHIPU_API_KEY ? '已设置' : '未设置');
console.log('process.env.AI_API_KEY:', process.env.AI_API_KEY ? '已设置' : '未设置');

console.log('\nAI服务实例状态:');
console.log('aiService.provider:', aiService.provider);
console.log('aiService.apiKey:', aiService.apiKey ? '已设置' : '未设置');
console.log('aiService.apiKey值:', aiService.apiKey);

// 测试直接调用
console.log('\n🧪 直接测试智谱AI调用...');
aiService.callZhipu([
  { role: 'user', content: '你好，请回复"直接调用成功"' }
]).then(response => {
  console.log('✅ 直接调用成功:', response);
}).catch(error => {
  console.log('❌ 直接调用失败:', error.message);
});
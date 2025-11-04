// 智谱AI密钥检查工具
require('dotenv').config();

async function checkZhipuKey() {
  const apiKey = process.env.ZHIPU_API_KEY;
  
  console.log('🔍 智谱AI密钥检查工具');
  console.log('=' .repeat(50));
  
  // 1. 检查密钥是否配置
  if (!apiKey) {
    console.log('❌ 未找到ZHIPU_API_KEY环境变量');
    console.log('💡 请在 .env 文件中配置: ZHIPU_API_KEY=你的密钥');
    return;
  }
  
  if (apiKey === 'your-ai-api-key-here') {
    console.log('❌ 使用的是默认占位符密钥');
    console.log('💡 请替换为真实的智谱AI密钥');
    return;
  }
  
  console.log('✅ 密钥已配置');
  console.log('🔑 密钥格式:', apiKey.substring(0, 20) + '...' + apiKey.substring(apiKey.length - 10));
  
  // 2. 检查密钥格式
  const keyParts = apiKey.split('.');
  if (keyParts.length !== 2) {
    console.log('⚠️ 密钥格式可能不正确（应该包含一个点分隔符）');
  } else {
    console.log('✅ 密钥格式正确');
  }
  
  // 3. 测试API调用
  console.log('\n🧪 测试API连接...');
  
  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          { role: 'user', content: '你好，请回复"测试成功"' }
        ],
        max_tokens: 10,
        temperature: 0.1
      })
    });

    const data = await response.json();
    
    console.log('📡 HTTP状态码:', response.status);
    console.log('📄 响应数据:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ API调用成功！');
      console.log('🤖 AI响应:', data.choices?.[0]?.message?.content || '无响应内容');
      
      // 检查使用情况
      if (data.usage) {
        console.log('📊 本次调用消耗:');
        console.log('   - 输入tokens:', data.usage.prompt_tokens);
        console.log('   - 输出tokens:', data.usage.completion_tokens);
        console.log('   - 总计tokens:', data.usage.total_tokens);
      }
      
    } else {
      console.log('❌ API调用失败');
      
      // 分析具体错误
      if (response.status === 401) {
        console.log('🔐 错误类型: 认证失败');
        if (data.error?.message?.includes('过期')) {
          console.log('⏰ 原因: 密钥已过期');
          console.log('💡 解决方案:');
          console.log('   1. 登录智谱AI控制台: https://open.bigmodel.cn/');
          console.log('   2. 检查账户状态和余额');
          console.log('   3. 重新生成API密钥');
          console.log('   4. 更新.env文件中的密钥');
        } else if (data.error?.message?.includes('无效')) {
          console.log('🚫 原因: 密钥无效');
          console.log('💡 解决方案: 检查密钥是否正确复制');
        }
      } else if (response.status === 429) {
        console.log('🚦 错误类型: 请求频率限制');
        console.log('💡 解决方案: 稍后重试或升级套餐');
      } else if (response.status === 402) {
        console.log('💳 错误类型: 余额不足');
        console.log('💡 解决方案: 充值账户余额');
      }
    }
    
  } catch (error) {
    console.log('💥 网络请求失败:', error.message);
    console.log('🌐 请检查网络连接');
  }
  
  // 4. 提供账户检查指导
  console.log('\n📋 账户状态检查步骤:');
  console.log('1. 访问智谱AI控制台: https://open.bigmodel.cn/');
  console.log('2. 登录你的账户');
  console.log('3. 查看以下信息:');
  console.log('   - 账户余额（左上角）');
  console.log('   - API密钥状态（API密钥页面）');
  console.log('   - 使用统计（概览页面）');
  console.log('   - 套餐信息（计费中心）');
  
  console.log('\n🔄 常见解决方案:');
  console.log('1. 密钥过期 → 重新生成密钥');
  console.log('2. 余额不足 → 充值账户');
  console.log('3. 免费额度用完 → 升级付费套餐');
  console.log('4. 账户异常 → 联系客服');
}

// 运行检查
checkZhipuKey().then(() => {
  console.log('\n🏁 检查完成');
}).catch(error => {
  console.error('💥 检查过程出错:', error);
});
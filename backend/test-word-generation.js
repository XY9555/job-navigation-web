// 测试Word文档生成功能
const axios = require('axios');

async function testWordGeneration() {
  try {
    console.log('📄 测试Word文档生成功能');
    console.log('================================');
    
    // 1. 登录获取token
    console.log('1️⃣ 登录获取token...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      phone: '13800138000',
      password: '123456'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ 登录成功');
    
    // 2. 测试评测结果Word生成
    console.log('\n2️⃣ 测试评测结果Word生成...');
    const evaluationData = {
      score: 85,
      strengths: ['技能匹配度高', '项目经验丰富', '教育背景良好'],
      weaknesses: ['缺少移动端经验', '项目描述不够详细'],
      suggestions: ['学习React Native开发', '完善项目技术细节描述', '添加更多量化成果'],
      details: {
        content: 80,
        format: 85,
        experience: 90,
        skills: 85
      }
    };
    
    const sourceInfo = {
      type: 'test',
      fileName: '测试简历.docx',
      timestamp: new Date().toISOString()
    };
    
    const evaluationResponse = await axios.post(
      'http://localhost:3000/api/resumes/download-evaluation-report',
      { evaluationData, sourceInfo },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      }
    );
    
    console.log('✅ 评测报告生成成功');
    console.log('文件大小:', evaluationResponse.data.size, 'bytes');
    
    // 3. 测试匹配分析Word生成
    console.log('\n3️⃣ 测试匹配分析Word生成...');
    const analysisData = {
      matchingScore: 78,
      jobInfo: {
        title: '前端开发工程师',
        description: '负责公司前端产品开发，要求熟练掌握Vue.js、React等技术栈，有移动端开发经验优先。'
      },
      strengths: ['Vue.js技能匹配', '有相关项目经验', '学习能力强'],
      gaps: ['缺少React经验', '移动端开发经验不足'],
      suggestions: ['学习React框架', '补充移动端开发技能', '参与更多实际项目'],
      keywordMatches: ['Vue.js', 'JavaScript', 'HTML', 'CSS']
    };
    
    const matchingResponse = await axios.post(
      'http://localhost:3000/api/resumes/download-matching-report',
      { analysisData, sourceInfo },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      }
    );
    
    console.log('✅ 匹配分析报告生成成功');
    console.log('文件大小:', matchingResponse.data.size, 'bytes');
    
    console.log('\n🎉 Word文档生成功能测试完成！');
    
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

testWordGeneration();
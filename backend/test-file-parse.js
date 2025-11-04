// 测试文件解析功能
const fs = require('fs');
const path = require('path');
const fileParser = require('./services/fileParser');

async function testFileParser() {
  console.log('🧪 测试文件解析功能...');
  
  // 创建一个测试文本文件来模拟简历内容
  const testContent = `张三
前端开发工程师

个人信息：
姓名：张三
性别：男
年龄：25
电话：13800138000
邮箱：zhangsan@example.com
地址：北京市朝阳区

求职意向：
期望职位：前端开发工程师
期望薪资：15-20K
工作地点：北京

教育经历：
2018年9月 - 2022年6月  北京大学  计算机科学与技术  本科
主修课程：数据结构、算法、计算机网络、数据库原理

工作经历：
2022年7月 - 2024年3月  阿里巴巴集团  前端开发工程师
负责电商平台前端开发，使用Vue.js和React技术栈

技能特长：
JavaScript、TypeScript、Vue.js、React、Node.js、HTML、CSS、Git、Webpack

项目经历：
项目名称：电商管理系统
项目描述：负责整个电商管理系统的前端架构设计和开发
使用技术：Vue.js、Element UI、Axios`;

  // 将测试内容转换为Buffer（模拟文件上传）
  const testBuffer = Buffer.from(testContent, 'utf8');
  
  try {
    console.log('📄 开始解析测试内容...');
    
    // 测试文本解析功能
    const result = await fileParser.parseTextToResume(testContent, '张三-前端开发工程师简历.txt');
    
    console.log('✅ 解析结果:');
    console.log('📋 标题:', result.title);
    console.log('👤 个人信息:', result.personalInfo);
    console.log('💼 求职意向:', result.jobIntention);
    console.log('🎓 教育经历:', result.education.length, '条');
    console.log('💻 工作经历:', result.experience.length, '条');
    console.log('🛠️ 技能:', result.skills.length, '项');
    console.log('📁 项目:', result.projects.length, '个');
    console.log('📝 原始文本长度:', result.rawText.length, '字符');
    
    // 显示详细信息
    if (result.personalInfo.name) {
      console.log('   姓名:', result.personalInfo.name);
    }
    if (result.personalInfo.phone) {
      console.log('   电话:', result.personalInfo.phone);
    }
    if (result.personalInfo.email) {
      console.log('   邮箱:', result.personalInfo.email);
    }
    
    if (result.skills.length > 0) {
      console.log('   技能列表:', result.skills.map(s => s.name).join(', '));
    }
    
    console.log('\n🎯 解析功能测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

// 运行测试
testFileParser().then(() => {
  console.log('\n🏁 测试完成');
  process.exit(0);
}).catch(error => {
  console.error('💥 测试异常:', error);
  process.exit(1);
});
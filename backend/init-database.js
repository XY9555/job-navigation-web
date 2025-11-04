// 数据库初始化脚本
require('dotenv').config();
const { testConnection, syncDatabase } = require('./config/database');
const models = require('./models');

async function initializeDatabase() {
  console.log('🔧 初始化数据库...\n');
  
  try {
    // 1. 测试数据库连接
    console.log('1️⃣ 测试数据库连接...');
    const connected = await testConnection();
    
    if (!connected) {
      console.log('❌ 数据库连接失败');
      return;
    }
    
    // 2. 同步数据库表
    console.log('\n2️⃣ 创建数据库表...');
    await syncDatabase();
    
    // 3. 验证表结构
    console.log('\n3️⃣ 验证表结构...');
    const { User, Resume } = models;
    
    // 检查用户表
    const userTableInfo = await User.describe();
    console.log('✅ 用户表字段:', Object.keys(userTableInfo).join(', '));
    
    // 检查简历表
    const resumeTableInfo = await Resume.describe();
    console.log('✅ 简历表字段:', Object.keys(resumeTableInfo).join(', '));
    
    // 4. 创建测试数据（可选）
    console.log('\n4️⃣ 检查是否需要创建测试数据...');
    const userCount = await User.count();
    
    if (userCount === 0) {
      console.log('📝 创建测试用户...');
      const testUser = await User.create({
        phone: '13800138000',
        password: '123456',
        name: '测试用户',
        email: 'test@example.com'
      });
      
      console.log('✅ 测试用户创建成功，ID:', testUser.id);
      
      console.log('ℹ️ 用户将从空白简历状态开始，无预设简历数据');
    } else {
      console.log(`ℹ️ 数据库中已有 ${userCount} 个用户，跳过测试数据创建`);
    }
    
    console.log('\n🎉 数据库初始化完成！');
    console.log('\n📊 数据库信息:');
    console.log('- 类型: SQLite');
    console.log('- 文件: backend/data/database.sqlite');
    console.log('- 用户表: ✅ 已创建');
    console.log('- 简历表: ✅ 已创建');
    console.log('- 测试数据: ✅ 已准备');
    
    console.log('\n🚀 现在可以启动应用了:');
    console.log('1. 运行: start-development.bat');
    console.log('2. 或者: cd backend && node server.js');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    console.log('\n🔍 可能的解决方案:');
    console.log('1. 检查 backend/.env 配置文件');
    console.log('2. 确保有写入权限');
    console.log('3. 检查 SQLite 依赖是否安装');
  }
  
  process.exit(0);
}

// 运行初始化
initializeDatabase();
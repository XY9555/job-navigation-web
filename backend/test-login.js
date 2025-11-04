// 测试登录功能
const { sequelize } = require('./config/database');
const { User } = require('./models');

async function testLogin() {
  try {
    console.log('🔐 测试登录功能');
    console.log('================================');
    
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    const phone = '13800138000';
    const password = '123456';
    
    console.log(`\n🔍 测试登录: ${phone} / ${password}`);
    
    // 查找用户
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      console.log('❌ 用户不存在');
      return;
    }
    
    console.log('✅ 用户找到:', user.name);
    console.log('📱 手机号:', user.phone);
    console.log('🔒 密码哈希:', user.password.substring(0, 30) + '...');
    
    // 测试密码比较
    console.log('\n🔍 测试密码验证...');
    const isValid = await user.comparePassword(password);
    console.log('密码验证结果:', isValid ? '✅ 正确' : '❌ 错误');
    
    // 测试其他可能的密码
    const testPasswords = ['123456', '123', 'password', ''];
    console.log('\n🧪 测试多个密码:');
    for (const testPwd of testPasswords) {
      const result = await user.comparePassword(testPwd);
      console.log(`"${testPwd}": ${result ? '✅' : '❌'}`);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('详细错误:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testLogin();
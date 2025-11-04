// 重置用户密码脚本
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const { User } = require('./models');

async function resetUserPassword() {
  try {
    console.log('🔐 用户密码重置工具');
    console.log('================================');
    
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 查找现有用户
    const users = await User.findAll({
      attributes: ['id', 'phone', 'name', 'email']
    });
    
    if (users.length === 0) {
      console.log('❌ 没有找到用户');
      return;
    }
    
    console.log('\n📱 现有用户:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, 手机: ${user.phone}, 姓名: ${user.name || '未设置'}`);
    });
    
    // 为第一个用户重置密码
    const user = users[0];
    const newPassword = '123456'; // 设置新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await user.update({ password: hashedPassword });
    
    console.log('\n✅ 密码重置成功！');
    console.log('================================');
    console.log('📱 登录信息:');
    console.log(`手机号: ${user.phone}`);
    console.log(`密码: ${newPassword}`);
    console.log('================================');
    console.log('💡 请使用上述信息登录应用');
    
  } catch (error) {
    console.error('❌ 重置失败:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

resetUserPassword();
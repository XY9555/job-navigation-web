// 修复用户密码
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const { User } = require('./models');

async function fixUserPassword() {
  try {
    console.log('🔧 修复用户密码');
    console.log('================================');
    
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 查找用户
    const user = await User.findOne({ where: { phone: '13800138000' } });
    if (!user) {
      console.log('❌ 用户不存在');
      return;
    }
    
    console.log('✅ 找到用户:', user.name);
    
    // 手动生成密码哈希
    const newPassword = '123456';
    console.log('🔒 设置新密码:', newPassword);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    console.log('🔐 生成的哈希:', hashedPassword.substring(0, 30) + '...');
    
    // 直接更新数据库，绕过模型钩子
    await sequelize.query(
      'UPDATE users SET password = ? WHERE id = ?',
      {
        replacements: [hashedPassword, user.id],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('✅ 密码更新成功');
    
    // 验证更新后的密码
    const updatedUser = await User.findByPk(user.id);
    const isValid = await bcrypt.compare(newPassword, updatedUser.password);
    
    console.log('\n🧪 验证新密码:');
    console.log('密码验证结果:', isValid ? '✅ 正确' : '❌ 错误');
    
    if (isValid) {
      console.log('\n🎉 密码修复成功！');
      console.log('================================');
      console.log('📱 登录信息:');
      console.log('手机号: 13800138000');
      console.log('密码: 123456');
      console.log('================================');
    } else {
      console.log('❌ 密码修复失败');
    }
    
  } catch (error) {
    console.error('❌ 修复失败:', error.message);
    console.error('详细错误:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

fixUserPassword();
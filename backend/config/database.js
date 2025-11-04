// 数据库配置
const { Sequelize } = require('sequelize');
const path = require('path');

// 创建数据库连接
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: false
  }
});

// 测试连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ SQLite数据库连接失败:', error.message);
    return false;
  }
}

// 同步数据库表
async function syncDatabase() {
  try {
    console.log('🔄 检查数据库表结构...');
    
    // 只检查表是否存在，不修改表结构，保护现有数据
    await sequelize.sync({ 
      // 不使用 alter 或 force，只确保表存在
      logging: false // 减少日志输出
    });
    
    console.log('✅ 数据库表检查完成，现有数据已保护');
  } catch (error) {
    console.error('❌ 数据库表检查失败:', error.message);
    
    // 即使出错也不强制重建，保护数据安全
    console.log('⚠️ 数据库可能需要手动检查，但不会自动重建以保护现有数据');
    console.log('💡 如需重建数据库，请手动运行: npm run reset-db');
  }
}

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
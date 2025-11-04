// 云端数据库配置
const { Sequelize } = require('sequelize');

// 根据环境选择数据库配置
const getDatabaseConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    // 生产环境：使用云端PostgreSQL
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    });
  } else {
    // 开发环境：继续使用SQLite
    return new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: console.log
    });
  }
};

const sequelize = getDatabaseConfig();

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    return false;
  }
};

// 同步数据库
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库同步成功');
    return true;
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
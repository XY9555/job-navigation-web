// SQLite模型索引文件
const { sequelize } = require('../config/database');
const User = require('./User');
const Resume = require('./Resume');

// 定义关联关系
User.hasMany(Resume, {
  foreignKey: 'userId',
  as: 'resumes'
});

Resume.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// 导出所有模型
const models = {
  User,
  Resume,
  sequelize
};

module.exports = models;
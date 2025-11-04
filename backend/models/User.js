// SQLite用户模型
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: true,
      len: [11, 11]
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('男', '女', '其他'),
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 16,
      max: 100
    }
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['phone']
    }
  ]
});

// 密码加密中间件
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// 实例方法：验证密码
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 实例方法：转换为JSON（隐藏密码）
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;
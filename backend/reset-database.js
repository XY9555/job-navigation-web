// 重置数据库
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize } = require('./config/database');

async function resetDatabase() {
  console.log('🔄 重置数据库...');
  
  try {
    // 关闭现有连接
    await sequelize.close();
    console.log('✅ 关闭数据库连接');
    
    // 删除数据库文件
    const dbFile = path.join(__dirname, 'data', 'database.sqlite');
    if (fs.existsSync(dbFile)) {
      fs.unlinkSync(dbFile);
      console.log('✅ 删除数据库文件');
    }
    
    // 重新创建sequelize实例
    console.log('🔄 重新创建数据库连接...');
    const { Sequelize } = require('sequelize');
    
    const newSequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbFile,
      logging: false,
      define: {
        timestamps: true,
        underscored: false,
        freezeTableName: false
      }
    });
    
    await newSequelize.authenticate();
    console.log('✅ 重新连接数据库');
    
    // 重新定义模型
    const { DataTypes } = require('sequelize');
    const bcrypt = require('bcryptjs');
    
    const User = newSequelize.define('User', {
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
      tableName: 'users'
    });
    
    const Resume = newSequelize.define('Resume', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100]
        }
      },
      personalInfo: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      jobIntention: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      education: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      workExperience: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      projects: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      certificates: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      selfEvaluation: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      evaluation: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        allowNull: false,
        defaultValue: 'draft'
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      tableName: 'resumes'
    });
    
    // 定义关联关系
    User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });
    Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    
    // 密码加密中间件
    User.beforeCreate(async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    });
    
    // 同步所有表
    await newSequelize.sync({ force: true });
    console.log('✅ 数据库表创建成功');
    
    // 创建测试数据
    console.log('📝 创建测试数据...');
    
    const testUser = await User.create({
      phone: '13800138000',
      password: '123456',
      name: '测试用户',
      email: 'test@example.com'
    });
    
    console.log('✅ 测试用户创建成功，ID:', testUser.id);
    console.log('ℹ️ 用户将从空白简历状态开始');
    
    // 验证数据
    const userCount = await User.count();
    const resumeCount = await Resume.count();
    
    console.log('\n📊 数据库重置完成:');
    console.log('👥 用户数量:', userCount);
    console.log('📄 简历数量:', resumeCount);
    
    console.log('\n🎉 数据库重置成功！');
    console.log('🔑 测试账号: 13800138000 / 123456');
    
  } catch (error) {
    console.error('❌ 重置失败:', error.message);
    console.error('🔍 错误详情:', error);
  } finally {
    if (typeof newSequelize !== 'undefined') {
      await newSequelize.close();
    }
    process.exit(0);
  }
}

// 运行重置
resetDatabase();
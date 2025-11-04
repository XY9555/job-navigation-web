// 数据库诊断脚本
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize, testConnection } = require('./config/database');

async function diagnoseDatabaseIssues() {
  console.log('🔍 数据库问题诊断工具');
  console.log('=' .repeat(50));
  
  try {
    // 1. 检查数据目录
    console.log('\n1️⃣ 检查数据目录...');
    const dataDir = path.join(__dirname, 'data');
    const dbFile = path.join(dataDir, 'database.sqlite');
    
    console.log('📁 数据目录:', dataDir);
    console.log('📄 数据库文件:', dbFile);
    
    if (!fs.existsSync(dataDir)) {
      console.log('⚠️ 数据目录不存在，正在创建...');
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('✅ 数据目录创建成功');
    } else {
      console.log('✅ 数据目录存在');
    }
    
    if (fs.existsSync(dbFile)) {
      const stats = fs.statSync(dbFile);
      console.log('✅ 数据库文件存在');
      console.log('📊 文件大小:', stats.size, '字节');
      console.log('📅 修改时间:', stats.mtime);
    } else {
      console.log('ℹ️ 数据库文件不存在（首次运行正常）');
    }
    
    // 2. 测试数据库连接
    console.log('\n2️⃣ 测试数据库连接...');
    const connected = await testConnection();
    
    if (!connected) {
      console.log('❌ 数据库连接失败，停止诊断');
      return;
    }
    
    // 3. 检查现有表
    console.log('\n3️⃣ 检查现有表...');
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    
    console.log('📋 现有表:', tables.length > 0 ? tables.join(', ') : '无');
    
    // 4. 检查每个表的结构
    if (tables.length > 0) {
      console.log('\n4️⃣ 检查表结构...');
      for (const table of tables) {
        try {
          const columns = await queryInterface.describeTable(table);
          console.log(`📊 表 ${table}:`, Object.keys(columns).join(', '));
        } catch (error) {
          console.log(`❌ 无法描述表 ${table}:`, error.message);
        }
      }
    }
    
    // 5. 尝试创建测试表
    console.log('\n5️⃣ 测试表创建...');
    try {
      await queryInterface.createTable('test_table', {
        id: {
          type: sequelize.Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: sequelize.Sequelize.STRING(50),
          allowNull: false
        },
        createdAt: {
          type: sequelize.Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: sequelize.Sequelize.DATE,
          allowNull: false
        }
      });
      
      console.log('✅ 测试表创建成功');
      
      // 删除测试表
      await queryInterface.dropTable('test_table');
      console.log('✅ 测试表删除成功');
      
    } catch (error) {
      console.log('❌ 测试表创建失败:', error.message);
    }
    
    // 6. 检查模型定义
    console.log('\n6️⃣ 检查模型定义...');
    const models = require('./models');
    console.log('📋 已定义模型:', Object.keys(models).join(', '));
    
    // 7. 尝试同步单个模型
    console.log('\n7️⃣ 测试模型同步...');
    const { User, Resume } = models;
    
    try {
      console.log('🔄 同步用户模型...');
      await User.sync({ alter: true });
      console.log('✅ 用户模型同步成功');
      
      console.log('🔄 同步简历模型...');
      await Resume.sync({ alter: true });
      console.log('✅ 简历模型同步成功');
      
    } catch (error) {
      console.log('❌ 模型同步失败:', error.message);
      console.log('🔍 详细错误:', error);
    }
    
    // 8. 检查数据
    console.log('\n8️⃣ 检查数据...');
    try {
      const userCount = await User.count();
      const resumeCount = await Resume.count();
      
      console.log('👥 用户数量:', userCount);
      console.log('📄 简历数量:', resumeCount);
      
    } catch (error) {
      console.log('❌ 数据查询失败:', error.message);
    }
    
    console.log('\n🎉 诊断完成！');
    
  } catch (error) {
    console.error('💥 诊断过程出错:', error.message);
    console.error('🔍 错误详情:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// 运行诊断
diagnoseDatabaseIssues();
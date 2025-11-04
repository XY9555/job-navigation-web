// 修复数据库问题
require('dotenv').config();
const { sequelize } = require('./config/database');

async function fixDatabaseIssues() {
  console.log('🔧 修复数据库问题...');
  
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // 1. 检查并删除备份表
    console.log('\n1️⃣ 清理备份表...');
    const tables = await queryInterface.showAllTables();
    
    const backupTables = tables.filter(table => table.includes('_backup'));
    if (backupTables.length > 0) {
      console.log('🗑️ 发现备份表:', backupTables.join(', '));
      
      for (const table of backupTables) {
        try {
          await queryInterface.dropTable(table);
          console.log(`✅ 删除备份表: ${table}`);
        } catch (error) {
          console.log(`⚠️ 删除备份表失败 ${table}:`, error.message);
        }
      }
    } else {
      console.log('ℹ️ 没有发现备份表');
    }
    
    // 2. 重新同步模型
    console.log('\n2️⃣ 重新同步数据库模型...');
    
    // 导入模型
    const User = require('./models/User');
    const Resume = require('./models/Resume');
    
    try {
      // 先同步用户表
      console.log('🔄 同步用户表...');
      await User.sync({ alter: true });
      console.log('✅ 用户表同步成功');
      
      // 再同步简历表
      console.log('🔄 同步简历表...');
      await Resume.sync({ alter: true });
      console.log('✅ 简历表同步成功');
      
    } catch (syncError) {
      console.log('⚠️ alter同步失败，尝试强制重建...');
      console.log('错误:', syncError.message);
      
      // 如果alter失败，询问是否强制重建
      console.log('\n⚠️ 警告：强制重建将删除所有数据！');
      console.log('如果这是开发环境且数据可以丢失，可以继续...');
      
      // 在开发环境中自动重建
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 开发环境，执行强制重建...');
        
        await User.sync({ force: true });
        console.log('✅ 用户表强制重建成功');
        
        await Resume.sync({ force: true });
        console.log('✅ 简历表强制重建成功');
        
        // 创建测试数据
        console.log('\n3️⃣ 创建测试数据...');
        const testUser = await User.create({
          phone: '13800138000',
          password: '123456',
          name: '测试用户',
          email: 'test@example.com'
        });
        
        console.log('✅ 测试用户创建成功，ID:', testUser.id);
        
        const testResume1 = await Resume.create({
          userId: testUser.id,
          title: '前端开发工程师简历',
          personalInfo: {
            name: '张三',
            phone: '13800138000',
            email: 'zhangsan@example.com',
            gender: '男',
            age: 25
          },
          jobIntention: {
            position: '前端开发工程师',
            salary: '15-20K',
            city: '北京',
            jobType: '全职'
          },
          education: [{
            school: '北京大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2018-09',
            endDate: '2022-06',
            description: '主修计算机科学与技术，成绩优秀'
          }],
          workExperience: [],
          skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'Vue.js', level: 85 },
            { name: 'React', level: 80 },
            { name: 'HTML/CSS', level: 90 },
            { name: 'Node.js', level: 75 }
          ],
          projects: [{
            name: '电商管理系统',
            role: '前端负责人',
            startDate: '2023-01',
            endDate: '2023-06',
            description: '负责整个电商管理系统的前端架构设计和开发',
            technologies: ['Vue.js', 'Element UI', 'Axios']
          }]
        });
        
        const testResume2 = await Resume.create({
          userId: testUser.id,
          title: 'Java后端开发简历',
          personalInfo: {
            name: '李四',
            phone: '13900139000',
            email: 'lisi@example.com',
            gender: '女',
            age: 28
          },
          jobIntention: {
            position: 'Java后端开发工程师',
            salary: '20-25K',
            city: '上海',
            jobType: '全职'
          },
          education: [{
            school: '清华大学',
            major: '软件工程',
            degree: '硕士',
            startDate: '2016-09',
            endDate: '2019-06'
          }],
          workExperience: [{
            company: '某互联网公司',
            position: 'Java开发工程师',
            startDate: '2019-07',
            endDate: '2024-10',
            description: '负责后端服务开发和架构设计'
          }],
          skills: [
            { name: 'Java', level: 95 },
            { name: 'Spring Boot', level: 90 },
            { name: 'MySQL', level: 85 },
            { name: 'Redis', level: 80 }
          ],
          projects: [{
            name: '微服务架构系统',
            role: '后端负责人',
            startDate: '2022-01',
            endDate: '2023-12',
            description: '设计和实现微服务架构，提升系统性能',
            technologies: ['Spring Cloud', 'Docker', 'Kubernetes']
          }]
        });
        
        console.log('✅ 测试简历创建成功，ID:', testResume1.id, testResume2.id);
      }
    }
    
    // 4. 验证修复结果
    console.log('\n4️⃣ 验证修复结果...');
    const userCount = await User.count();
    const resumeCount = await Resume.count();
    
    console.log('👥 用户数量:', userCount);
    console.log('📄 简历数量:', resumeCount);
    
    console.log('\n🎉 数据库修复完成！');
    
  } catch (error) {
    console.error('❌ 修复失败:', error.message);
    console.error('🔍 错误详情:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// 运行修复
fixDatabaseIssues();
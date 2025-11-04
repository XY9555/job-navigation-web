# 求职导航APP

一个帮助求职者分析简历的智能移动应用。

## 功能特性

- 📄 个人简历创建和管理
- 📊 AI简历评测分析
- 🎯 职位匹配分析
- 💬 面试问题生成
- 📱 原生Android应用

## 技术栈

### 前端
- Vue.js 3
- Capacitor (跨平台移动开发)
- Vite (构建工具)

### 后端
- Node.js + Express
- Sequelize ORM
- SQLite (开发) / PostgreSQL (生产)

### AI服务
- 智谱AI (GLM-4)

## 部署

### 开发环境
```bash
# 安装依赖
npm install
cd backend && npm install

# 启动后端
cd backend && npm run dev

# 启动前端
npm run dev

# 构建Android应用
npm run build
npx cap sync android
npx cap open android
```

### 生产环境
```bash
# 构建生产版本
npm run build

# 部署到云端
# 详见 CLOUD_DEPLOYMENT_GUIDE.md
```

## 环境变量

### 后端 (.env)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
ZHIPU_API_KEY=your_api_key
PORT=10000
```

## 许可证

MIT License
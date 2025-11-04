# 🚀 云端部署检查清单

## 准备阶段 ✅

- [ ] 确保有GitHub账号
- [ ] 确保有智谱AI API密钥
- [ ] 项目代码完整无误

## GitHub设置 ✅

- [ ] 创建新仓库 `job-navigation-app`
- [ ] 设置为Public仓库
- [ ] 上传所有代码到GitHub

```bash
git init
git add .
git commit -m "Initial commit - Job Navigation App"
git branch -M main
git remote add origin https://github.com/你的用户名/job-navigation-app.git
git push -u origin main
```

## Render部署 ✅

### 1. 创建Web Service
- [ ] 访问 [render.com](https://render.com)
- [ ] 注册/登录账号
- [ ] 点击 "New +" → "Web Service"
- [ ] 连接GitHub仓库
- [ ] 配置设置：
  - **Name**: `job-navigation-api`
  - **Root Directory**: `backend`
  - **Environment**: `Node`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Plan**: `Free`

### 2. 创建数据库
- [ ] 点击 "New +" → "PostgreSQL"
- [ ] 配置：
  - **Name**: `job-navigation-db`
  - **Plan**: `Free`
- [ ] 复制 "External Database URL"

### 3. 设置环境变量
在Web Service的Environment页面添加：
- [ ] `NODE_ENV` = `production`
- [ ] `ZHIPU_API_KEY` = `你的智谱AI密钥`
- [ ] `DATABASE_URL` = `复制的数据库URL`

## 部署验证 ✅

- [ ] 等待部署完成（5-10分钟）
- [ ] 检查部署日志无错误
- [ ] 访问健康检查端点：`https://你的域名.onrender.com/api/health`
- [ ] 确认返回成功响应

## APP配置更新 ✅

- [ ] 记录你的API地址
- [ ] 运行 `update-api-url.bat`
- [ ] 输入正确的API地址
- [ ] 等待构建完成

## 最终测试 ✅

- [ ] 在Android Studio中构建APK
- [ ] 安装到手机
- [ ] 测试所有功能：
  - [ ] 用户注册/登录
  - [ ] 创建简历
  - [ ] 简历评测
  - [ ] 职位匹配
  - [ ] 面试问题生成

## 🎉 部署成功！

你的APP现在：
- ✅ 完全独立运行
- ✅ 不依赖电脑
- ✅ 数据云端存储
- ✅ 全球访问

## 📞 遇到问题？

1. 检查Render部署日志
2. 确认环境变量设置正确
3. 验证API地址配置
4. 查看APP调试面板

## 💰 成本说明

- **Render Free Plan**: 500小时/月
- **PostgreSQL Free**: 1GB存储
- **总成本**: $0/月（免费使用）

## 🔄 后续维护

- 代码更新：推送到GitHub自动重新部署
- 数据库：自动备份和维护
- 监控：Render提供基础监控
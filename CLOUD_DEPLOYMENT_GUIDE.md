# 🚀 云端部署完整指南

## 第一步：准备GitHub仓库

1. 创建GitHub账号（如果没有）
2. 创建新仓库 `job-navigation-app`
3. 上传你的代码：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/job-navigation-app.git
git push -u origin main
```

## 第二步：部署后端到Render

1. 访问 [render.com](https://render.com)
2. 注册账号（可用GitHub登录）
3. 点击 "New +" → "Web Service"
4. 连接你的GitHub仓库
5. 配置：
   - **Name**: `job-navigation-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

6. 添加环境变量：
   - `NODE_ENV` = `production`
   - `ZHIPU_API_KEY` = `你的智谱AI密钥`

7. 点击 "Create Web Service"

## 第三步：设置数据库

1. 在Render控制台，点击 "New +" → "PostgreSQL"
2. 配置：
   - **Name**: `job-navigation-db`
   - **Plan**: `Free`
3. 创建后，复制 "External Database URL"
4. 在Web Service中添加环境变量：
   - `DATABASE_URL` = `复制的数据库URL`

## 第四步：更新APP配置

1. 等待Render部署完成（约5-10分钟）
2. 获取你的API地址：`https://你的服务名.onrender.com`
3. 更新 `src/config/api-config.js` 中的生产环境地址
4. 重新构建APP

## 第五步：构建生产版本APK

1. 运行 `deploy-production.bat`
2. 在Android Studio中构建签名APK
3. 测试所有功能

## 🎉 完成！

你的APP现在可以：
- ✅ 独立运行，不依赖电脑
- ✅ 随时随地使用
- ✅ 数据云端存储
- ✅ AI功能正常工作

## 💰 成本

- **开发阶段**: 完全免费
- **Render免费层**: 500小时/月（足够个人使用）
- **数据库**: 免费1GB存储
- **总成本**: $0/月

## 🔧 维护

- Render会自动从GitHub部署
- 推送代码更新会自动重新部署
- 数据库自动备份

## 📞 技术支持

如果遇到问题：
1. 检查Render部署日志
2. 查看APP调试面板
3. 联系技术支持